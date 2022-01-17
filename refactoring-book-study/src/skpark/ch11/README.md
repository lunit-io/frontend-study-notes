# 11.2 함수 매개변수화 하기 Parameterize Function

마우스 스크롤 deltaY를 매개변수로 받아, 스크롤 방향에 따른 처리

```ts
// ...
const handleFrame: Wheel = (_, deltaY) => {
  if (deltaY !== 0)
    setFrame((prev) =>
      Math.min(Math.max(prev + (deltaY > 0 ? 1 : -1), MIN_FRAME), MAX_FRAME)
    );
};
```

# 11.3 플래그 인수 제거하기 Remove Flag Argument

## 1. before

```ts
export default function getHttpClient(
  requestInterceptor: RequestInterceptor,
  multiple = false
): HttpClient {
  const httpClient: HttpClient = async (url) => {
    const http = ky.create({
      hooks: {
        beforeRequest: [
          (request) => {
            requestInterceptor(request);
          },
        ],
      },
      onDownloadProgress: async (progress) => {
        if (!multiple)
          loadingProgressMessage.sendMessage(
            Math.round(progress.percent * 100)
          );
      },
    });

    const res = await http.get(url);
    return res.arrayBuffer();
  };

  return httpClient;
}
// single
getHttpClient(requestInterceptor);
// multiple
getHttpClient(requestInterceptor, true);
```

## 2. after

```ts
export default function getHttpClient({
  requestInterceptor,
  onDownloadProgress,
}: {
  requestInterceptor: RequestInterceptor;
  onDownloadProgress:
    | ((progress: DownloadProgress, chunk: Uint8Array) => void)
    | undefined;
}): HttpClient {
  const httpClient: HttpClient = async (url) => {
    const http = ky.create({
      hooks: {
        beforeRequest: [
          (request) => {
            requestInterceptor(request);
          },
        ],
      },
      onDownloadProgress,
    });

    const res = await http.get(url);
    return res.arrayBuffer();
  };

  return httpClient;
}

async function handleDownloadProgress(progress) {
  loadingProgressMessage.sendMessage(Math.round(progress.percent * 100));
}
// single
getHttpClient({
  requestInterceptor,
  onDownloadProgress: handleDownloadProgress,
});
// multiple
getHttpClient({ requestInterceptor, onDownloadProgress: undefined });

// --------------- OR ---------------
function getSingleHttpClient({ requestInterceptor }) {
  return getHttpClient({
    requestInterceptor,
    onDownloadProgress: handleDownloadProgress,
  });
}

function getMultipleHttpClient({ requestInterceptor }) {
  return getHttpClient({
    requestInterceptor,
  });
}
// single
getSingleHttpClient(requestInterceptor);
// multiple
getMultipleHttpClient(requestInterceptor);
```

# 11.4 객체 통째로 넘기기 Preserve Whole Object

```ts
const pan: Pan = (viewport, delta) => ({
  x: viewport.translation.x + delta.x / viewport.scale,
  y: viewport.translation.y + delta.y / viewport.scale,
});
```

# 11.9 함수를 명령으로 바꾸기 Replace Function with Command

```ts
interface Command {
  execute(): void;
}
function hello(cmd: Command) {
  cmd.execute();
}
class Rabbit implements Command {
  execute() {
    console.log("／(≧ x ≦)＼");
  }
}
class Bear implements Command {
  execute() {
    console.log("⊙ܫ⊙");
  }
}
class Dog implements Command {
  execute() {
    console.log("୧| ⁰ ᴥ ⁰ |୨");
  }
}
executor(new Rabbit());
executor(new Bear());
executor(new Dog());
```

# 11.11 수정된 값 반환하기 Return Modified Value

```ts
const defaultRenderRow = (row) => (
  <TableRow {...row.getRowProps()}>
    {row.cells.map(({ cell: { column } }) => {
      return (
        <Td {...cell.getCellProps()} align={column.align}>
          {cell.render("Cell")}
        </Td>
      );
    })}
  </TableRow>
);
```

# 11.12 오류 코드를 예외로 바꾸기 Replace Error Code with Exception

```js
const getImage = async ({ imageId, requestInterceptor }) => {
  // ...
  try {
    return await cornerstoneLoadImage(imageId, {
      loader: getHttpClient(requestInterceptor),
    })
  } catch (e) {
    throw formatError(e)
  }
}

async function loadImage(...) {
  // ...
  try {
    return await getImage({
      imageId,
      requestInterceptor,
    })
  } catch (e) {
    onError(e)
    throw e
  }
}
```

# 11.13 예외를 사전 확인으로 바꾸기 Replace Exception with Precheck

```ts
(async function asyncLoad(): Promise<void> {
  if (!hasLoader) setHasLoader(await setLoader());
})();
```
