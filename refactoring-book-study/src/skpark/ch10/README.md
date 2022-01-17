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
    return { x, y };
  }

  const { translation: { x = 0, y = 0 } = {} } =
    getViewport(<HTMLDivElement>element) ?? {};
  return { x, y };
}
```

# 10.4 조건부 로직을 다형성으로 바꾸기 Replace Conditional with Polymorphism

즉시 값을 내보내는 스케줄러와 비동기로 값을 내보내는 스케줄러를 일관된 API로 처리한다.

```ts
interface Scheduler {
	schedule(work: Function): void
}

const syncScheduler: Scheduler = {
  schedule(work) {
    work()
  }
}

const asyncScheduler: Scheduler = {
  schedule(work) {
    setTimeout(work, 0)
  }
}

class Observable() {
  constructor(
    private observer: (observer: Observer<T>) => (() => void) | void,
    private scheduler: Scheduler = syncScheduler
  ) {}

  subscribe(
    next?: (value: T) => void,
    error? (err: any) => void,
    complete?: () => void
  ): Subscription {
    const observer: Observer<T> => {
      next: (value: T) => {
        if (next) this.scheduler.schedule(() => next(value))
      },
      error: (err: any) => {
        if (error) this.scheduler.schedule(() => error(err))
      },
      complete: () => {
        if (complete) this.scheduler.schedule(() => complete())
      }
    }

    const teardown = this.observe(observer)

    return {
      unsubscribe() {
        if (teardown) teardown()
      }
    }
  }
}

const sync$ = new Observable((observer) => {
  // ...
}, syncScheduler)

const async$ = new Observable((observer) => {
  // ...
}, asyncScheduler)
```
