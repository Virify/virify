export default function useCardHoverState() {
  return useState<null | number>('card-hover-state-id', () => null)
}