# 9.1 변수 쪼개기 Split Variable

입력 매개변수의 값을 수정할 때

```ts
// ...
switchMap((start) => {
  let lastX = start.pageX; // <-- 입력 매개변수 쪼개기
  let lastY = start.pageY;

  return mousemove$.pipe(
    map((move: MouseEvent) => {
      move.preventDefault();
      const deltaX = move.pageX - lastX;
      const deltaY = move.pageY - lastY;
      lastX = move.pageX;
      lastY = move.pageY;

      return {
        x: deltaX,
        y: deltaY,
      };
    }),
    takeUntil(mouseup$)
  );
});
```

# 9.2 필드 이름 바꾸기 Rename Field

## 1. before

```ts
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof userSchema>;

const user = userSchema.parse({
  name: "Snoopy",
  age: 16,
});

// user: { name: 'Jane', age: 16 }
```

## 2. after

```ts
import { z } from "zod";

const userSchema = z
  .object({
    name: z.string(),
    age: z.number(),
  })
  .transform((v) => ({
    title: v.name,
    age: v.age,
  }));

type User = z.infer<typeof userSchema>;

const user = userSchema.parse({
  name: "Snoopy",
  age: 16,
});

// user: { title: 'Jane', age: 16 }
```

# 9.3 파생 변수를 질의 함수로 바꾸기 Replace Derived Variable with Query

계산 과정을 보여주는 코드 자체가 데이터의 의미를 더 분명히 드러내는 경우

```tsx
import * as R from "ramda";

function getSum(obj) {
  return R.sum(R.values(obj));
}

export default function App() {
  return <div>total: {getSum({ a: 1, b: 2, c: 3 })}</div>;
}
```

# 9.4 참조를 값으로 바꾸기 Change Reference to Value

```ts
$box.addEventListener("click", (e) => {
  const { currentTarget } = e; // <--- 참조를 구조분해 할당을 사용하여 값으로 변환

  setTimeout(() => {
    console.log("currentTarget", e.currentTarget); // null
    console.log("cached currentTarget", currentTarget); // <div class="box">...</div>
  });
});
```

# 9.5 값을 참조로 바꾸기 Change Value to Reference

Redux 사용

# 9.6 매직 리터럴 바꾸기 Replace Magic Literal

MouseEvent.button 타입 상수

```ts
export const MOUSE_BUTTON = {
  primary: 0,
  secondary: 2,
};
```
