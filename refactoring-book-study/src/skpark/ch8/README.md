# 8.3 문장을 함수로 옮기기 move statements into function

## 1. before
```ts
// ...
.subscribe(dragged => {
  const interactonType = interaction[dragType]

  if (...) {
    if (typeof interactonType === 'string') {
      setViewport(
        <HTMLDivElement>element,
        formatCornerstoneViewport(
          viewport,
          (control[interactonType] as BasicPan | BasicAdjust)?.(
            viewport,
            dragged
          )
        )
      )
    }
    if (typeof interactonType === 'function') {
      interactonType(viewport, dragged)
    }
  }
})
```

## 2. after
문장을 함수로 추출한 후, 최상위로 옮기기
```ts
// ...
.subscribe(dragged => {
  if (...) {
    handleInteraction({
      interaction,
      dragType,
      element,
      viewport,
      dragged,
    })
  }
})

function handleInteraction({
  interaction,
  dragType,
  element,
  viewport,
  dragged,
}): void {
  const interactonType = interaction[dragType]

  switch (typeof interactonType) {
    case 'string':
      setViewport(
        <HTMLDivElement>element,
        formatCornerstoneViewport(
          viewport,
          (control[interactonType] as BasicPan | BasicAdjust)?.(
            viewport,
            dragged
          )
        )
      )
      break
    case 'function':
      interactonType(viewport, dragged)
      break
    default:
      break
  }
}
```

# 8.5 인라인 코드를 함수 호출로 바꾸기 replace inline code with function call

```ts
function hasDragType(value: unknown): value is DragType {
  return value === PRIMARY_DRAG || value === SECONDARY_DRAG
}

// ...
filter(() => hasDragType(dragType)),

// ...
if (viewport && hasDragType(dragType)) {
  handleInteraction({
    ...
  })
}
```

# 8.7 반복문 쪼개기 split loop
관련된 코드들이 가까이 모여있다면 이해하기가 더 쉽다.

```ts
function PromiseAllWithProgress(
  promiseArray: Promise<CornerstoneImage>[]
) {
  let d = 0

  loadingProgressMessage.sendMessage(0)

  promiseArray.forEach(p => { // [2] 1에서 만든 이미지 로드 콜백을 실행하며 progress 처리하기
    p.then(() => {
      d += 1
      loadingProgressMessage.sendMessage(
        Math.round((d * 100) / promiseArray.length)
      )
    })
  })
  return Promise.all(promiseArray)
}

async function prefetch({
  images,
  requestInterceptor,
  onError,
}) {
  try {
    const loaders = images.map(image => // [1] 각 이미지의 load 콜백 배열 만들기
      loadImage(image, {
        loader: getHttpClient(requestInterceptor),
      })
    )
    return PromiseAllWithProgress(loaders)
  } catch (err) {
    onError(err)
    return undefined
  }
}
```

# 8.8 반복문을 파이프라인으로 바꾸기 replace loop with pipeline
react-table에서 Array.prototype.map 사용사례

```tsx
<table {...getTableProps()}>
  <thead ref={theadRef}>
    {headerGroups.map((headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((c) => {
          const column = c as unknown as TableColumn

          return (
            <th {...column.getHeaderProps()}>
              {column.render('Header')}
              <Resizer
                {...column.getResizerProps()}
                className={`${column.isResizing ? 'isResizing' : ''}`}
              />
            </th>
          )
        })}
      </tr>
    ))}
  </thead>
  // ...
```
