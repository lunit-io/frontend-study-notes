# 10.1 조건문 분해하기 Decompose Conditional

```ts
const control: Control = {
  pan,
  adjust,
};

// ...
onViewportChange((prev) => ({
  ...prev,
  // eventType: "pan" | "adjust"
  ...control[eventType]?.(viewport, dragged),
}));
```

# 10.2 조건식 통합하기 Consolidate Conditional Expression

```ts
function hasClickType(
  clickType: ClickType | undefined,
  interaction: Interaction
) {
  return (
    (clickType === PRIMARY_CLICK || clickType === SECONDARY_CLICK) &&
    interaction[clickType] !== undefined
  );
}
```

# 10.3 중첩 조건문을 보호 구문으로 바꾸기 Replace Nested Conditional with Guard Clauses

```ts
function getCoord(element: Element, viewport?: Viewport) {
  if (viewport && isValidViewport(viewport)) {
    const { x, y } = viewport;
    return {
      x,
      y,
    };
  }

  const { translation: { x = 0, y = 0 } = {} } =
    getViewport(<HTMLDivElement>element) ?? {};
  return { x, y };
}
```
