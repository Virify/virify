interface ChartNode {
  offset: number
  height: number
}

interface Config extends Record<string, unknown> {
  width?: number
  height?: number
  paddingX?: number
  paddingY?: number
  emptyFillColour?: string
  emptyFillFadedColour?: string
  fillColour?: string
  fillFadedColour?: string
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

interface DrawActiveArea {
  min: number
  max: number
}

interface DrawCanvasConfig {
  activeArea: DrawActiveArea
  width: number
  height: number
  strokeColor: string
  fillColour: string
  fillFadedColour: string
  startY: number
  computedData: ChartNode[]
}

type Canvas = HTMLCanvasElement

/**
 *  Create a chart on a canvas
 */
export function usePriceChart(canvas: Canvas, userConfig: Config = {}) {
  const isCanvas = canvas instanceof HTMLCanvasElement

  // Validate data
  if (!isCanvas) {
    throw createError({
      statusCode: 400,
      message: 'Invalid config provided for price chart',
      fatal: false
    })
  }

  // Create default config
  const config = {
    width: 600,
    height: 80,
    paddingX: 0,
    paddingY: 0,
    emptyRGB: '165, 165, 165',
    filledRGB: '253, 142, 97',
    pixelDensity: 2,
    ...asObject(userConfig)
  }

  // Destructure config
  const {
    width,
    height,
    paddingX,
    paddingY,
    emptyRGB,
    filledRGB,
    pixelDensity
  } = config

  // Compile colours
  const emptyFillColour = `rgba(${emptyRGB}, 0.25)`;
  const emptyFillFadedColour = `rgba(${emptyRGB}, 0)`;
  const fillColour = `rgba(${filledRGB}, 1)`;
  const fillFadedColour = `rgba(${filledRGB}, 0.4)`;
  const strokeColor = `rgb(${filledRGB})`;

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
  const createGetNodes = (computedNodes: ChartNode[], startY: number) => {
    const fallbackNode = { offset: width - paddingX, height: startY }

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
  function getPercentAsCoord(width: number, percent?: number) {
    if (!Number(percent)) return 0

    return Math.round(width * (percent as number / 100))
  }

  /**
   *  Function draw
   */
  function drawChartColour(context: CanvasRenderingContext2D, config: DrawCanvasConfig, isActive?: boolean) {
    const { activeArea, width, height, strokeColor, fillColour, fillFadedColour, startY, computedData } = config

    // Get nodes
    const { nodes, getNode } = createGetNodes(computedData, startY)

    // Start a path
    context.strokeStyle = strokeColor
    context.lineWidth = 2

    // Create clip area
    const activeX = activeArea.min
    const activeWidth = activeArea.max - activeArea.min

    // Start new path
    context.beginPath()

    // Set correct clip states
    if (isActive) {
      context.clearRect(activeX, 0, activeWidth, height);

      // Create clip
      context.rect(activeX, 0, activeWidth, height)
      context.clip()

      // Start line
      context.beginPath()
    }

    // Start line
    context.lineTo(paddingX, startY)

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

    // Create gradient
    const gradient = context.createLinearGradient(0, 0, 0, height)

    gradient.addColorStop(0, fillColour);
    gradient.addColorStop(1, fillFadedColour);

    context.fillStyle = gradient

    // Stroke and fill 
    context.lineTo(width - paddingX, startY)
    context.fill()

    if (!isActive) {

      context.stroke()
    }
  }

  /**
   *  Function to draw chart
   */
  function drawChart(data: number[], { min, max }: DrawCanvas) {
    if (!Array.isArray(data) || !data.every(isNumber)) {
      console.error('Invalid data supplied to drawCart')
      return
    }

    // Check the maximum height of all rows
    const maxRow = Math.max(...data)

    // Get the chart width, height when accounting for padding
    const chartHeight = height - 2 * paddingY
    const chartWidth = width - 2 * paddingX

    // Get the spacing between each row, relative height of each row
    const chartSpacing = chartWidth / (data.length - 1)
    const chartHeightRatio = chartHeight / maxRow
    const chartYStart = chartHeight + paddingY

    // Convert chart into relative sizes, offsets
    const chartDataComputed = data.map((value, index) => {
      const relativeHeight = Math.round(chartHeightRatio * value)
      const offsetSize = chartSpacing * index

      return {
        height: chartYStart - Math.max(relativeHeight, 1),
        offset: paddingX + offsetSize
      }
    })

    const activeArea = {
      min: getPercentAsCoord(chartWidth, min),
      max: getPercentAsCoord(chartWidth, max)
    }

    // Get fresh canvas
    const context = getCleanContext()

    // Create config for drawing charts
    const config: DrawCanvasConfig = {
      activeArea,
      strokeColor: emptyFillColour,
      fillColour: emptyFillColour,
      fillFadedColour: emptyFillFadedColour,
      width: chartWidth,
      height: chartHeight,
      startY: chartYStart,
      computedData: chartDataComputed
    }

    // Draw background shape
    drawChartColour(context, config)

    // Draw orange shape
    drawChartColour(context, {
      ...config,
      strokeColor,
      fillColour: fillColour,
      fillFadedColour: fillFadedColour,
    }, true)
  }

  return {
    getCleanContext,
    drawChart
  }
}