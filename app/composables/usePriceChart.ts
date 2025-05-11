interface Data extends Record<string, unknown> {
  amount: number
}

interface ChartNode {
  offset: number
  height: number
}

interface Config extends Record<string, unknown> {
  data: Data[]
  width?: number
  height?: number
  paddingX?: number
  paddingY?: number
  lineThickness?: number
  emptyLineColour?: string
  lineColour?: string
  pixelDensity?: number
}

interface CleanCanvas {
  width: number
  height: number
  pixelDensity: number
}

interface DrawCanvas {
  min: number
  max: number
}

interface DrawCanvasClip {
  min: number
  max: number
}

type Canvas = HTMLCanvasElement

/**
 *  Create a chart on a canvas
 */
export function usePriceChart(canvas: Canvas, { data, ...userConfig }: Config) {
  const isCanvas = canvas instanceof HTMLCanvasElement
  const isValidData = Array.isArray(data)

  // Validate data
  if (!isCanvas || !isValidData) {
    throw createError({
      statusCode: 400,
      message: 'Invalid arguments provided for price chart',
      fatal: false
    })
  }

  // Create default config
  const config = {
    width: 600,
    height: 80,
    paddingX: 0,
    paddingY: 0,
    emptyLineColour: '#ccc',
    lineColour: '#fcc',
    pixelDensity: 2,
    ...userConfig
  }

  // Destructure config
  const {
    width,
    height,
    paddingX,
    paddingY,
    emptyLineColour,
    lineColour,
    pixelDensity
  } = config

  // Get relevant data, length
  const dataValues = data.map(({ amount }) => amount)

  // Check the maximum height of all rows
  const maxRow = Math.max(...dataValues)

  // Get the chart width, height when accounting for padding
  const chartHeight = height - 2 * paddingY
  const chartWidth = width - 2 * paddingX

  // Get the spacing between each row, relative height of each row
  const chartSpacing = chartWidth / (dataValues.length - 1)
  const chartHeightRatio = chartHeight / maxRow
  const chartYStart = chartHeight + paddingY

  // Convert chart into relative sizes, offsets
  const chartDataComputed = dataValues.map((value, index) => {
    const relativeHeight = Math.round(chartHeightRatio * value)
    const offsetSize = chartSpacing * index

    return {
      height: chartYStart - Math.max(relativeHeight, 1),
      offset: paddingX + offsetSize
    }
  })

  /**
   *  Closure function to clean the canvas
   */
  function createGetCleanContext(canvas: Canvas, {
    width,
    height,
    pixelDensity
  }: CleanCanvas) {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    // Resize canvas
    canvas.width = width * pixelDensity
    canvas.height = height * pixelDensity

    // Clear any existing context
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.scale(pixelDensity, pixelDensity)

    return context
  }

  /**
   *  Get the canvas context with the canvas reset
   */
  const getCleanContext = () => {
    return createGetCleanContext(canvas, { width, height, pixelDensity })
  }

  /**
   *  Closure function for getNotes
   */
  const createGetNodes = (computedNodes: ChartNode[]) => {
    const fallbackNode = { offset: width - paddingX, height: chartYStart }

    const nodes = unref(computedNodes)

    function getNode(index: number) {
      return nodes[index] || fallbackNode
    }

    return {
      nodes,
      getNode
    }
  }

  /**
   *  Get percentage as x-coord
   */
  function getPercentAsCoord(percent?: number) {
    if (!Number(percent)) return 0

    return Math.round(chartWidth * (percent as number / 100))
  }

  /**
   *  Function draw
   */
  function drawChartColour(context: CanvasRenderingContext2D, colour: string, clip?: DrawCanvasClip) {
    // Get nodes
    const { nodes, getNode } = createGetNodes(chartDataComputed)

    // Start a path
    context.lineJoin = 'round'
    context.fillStyle = colour

    // Start line
    context.beginPath()

    // Create clip, if provided
    if (clip) {
      const clipX = clip.min
      const clipWidth = clip.max - clip.min

      // Create clip
      context.rect(clipX, 0, clipWidth, chartHeight)
      context.clip()

      // Start line
      context.beginPath()
    }

    // Start line
    context.lineTo(paddingX, chartYStart)

    // Loop through rows and draw
    for (let index = 0; index < nodes.length; index++) {
      const current = getNode((index))
      const next = getNode((index) + 1)

      const currentOffset = current.offset
      const currentHeight = current.height
      const nextOffset = (next.offset + currentOffset) / 2
      const nextHeight = (next.height + currentHeight) / 2

      context.quadraticCurveTo(currentOffset, currentHeight, nextOffset, nextHeight)
    }

    context.lineTo(width - paddingX, chartYStart)
    context.closePath()
    context.fill()
  }

  /**
   *  Function to draw chart
   */
  function drawChart({ min, max }: DrawCanvas) {
    const clip = {
      min: getPercentAsCoord(min),
      max: getPercentAsCoord(max)
    }

    // Get fresh canvas
    const context = getCleanContext()

    // Draw background shape
    drawChartColour(context, emptyLineColour)

    // Draw orange shape
    drawChartColour(context, lineColour, clip)
  }

  return {
    getCleanContext,
    drawChart
  }
}