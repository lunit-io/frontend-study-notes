# 6.1 함수 추출하기 extract function

## 1. before

useMultiframe.ts

```ts
export function useMultiframe({
  images = [],
  initial = 0,
}: {
  images: string[]
  initial?: number
}): ReturnUseMultiframe {
  const { onError, setHeader } = useContext(ViewContext)
  const [frame, setFrame] = useState(initial)

  useEffect(() => {
    if (images.length === 0) return undefined
    wadoImageLoader$.subscribe(() => {
      prefetch({ images, setHeader, onError })
    })

    return undefined
  }, [images, onError, setHeader])

  return {
    frame,
    setFrame,
  }
}
```

한 파일에서 frame 핸들링과 이미지 prefetch를 같이 하고 있다.

useMultiframe를 export 할 때, images 값을 전달받기 위해 함수로 한 번 더 감싸야 한다.

```ts
export function curriedUseMultiframe(
  images: string[]
): ReturnCurriedUseMultiframe {
  return (initial = 0) => useMultiframe({ images, initial });
}
```

useMultiframe 사용 사례는 이렇다.

```ts
const { frame, setFrame } = useMultiframe();
```

prefetch 처리는 암묵적으로 발생하며, frame 처리 관련 속성을 export 하고 있다.

useMultiframe이란 이름은 애매모호한 면이 있다.

## 2. after

이를 usePrefetch와 useFrame으로 분리하여, 용도에 따라 사용하기

usePrefetch.ts

```ts
export default function usePrefetch(images: string[]): void {
  const { onError, setHeader } = useContext(ViewContext)

  useEffect(() => {
    if (images.length === 0) return undefined

    setWadoImageLoader(onError).then(async () => {
      await prefetch({ images, setHeader, onError })
    })

    return undefined
  }, [images, onError, setHeader])
```

useFrame.ts

```ts
const useFrame: UseFrame = (initial = 0) => {
  const [frame, setFrame] = useState(initial);

  return {
    frame,
    setFrame,
  };
};

export default useFrame;
```

사용 사례

뷰어에서 이미지를 prefetch 한다.

```ts
function DICOMImagesViewer({ imageId, images }) {
  usePrefetch(images);
  // ...
}
```

컴퍼넌트에서 현재 프레임을 가져오거나 설정할 수 있다.

```ts
function App() {
  const { frame, setFrame } = useFrame();
  return (
    <>
      <input
        type="range"
        id="frame"
        name="frame"
        min="0"
        max="10"
        step="1"
        defaultValue={0}
        onChange={(e) => {
          setFrame(Number(e.target.value));
        }}
      />
      <DICOMImageViewer imageId={IMAGES[frame]} />
    </>
  );
}
```

# 6.2 함수 인라인하기 inline function

## 1. before

```ts
function asyncLoad(): Promise<undefined> {
  if (hasLoader) return undefined;
  setHasLoader(await setLoader());
  return undefined;
}
asyncLoad();
```

## 2. after

함수 이름보다는 즉시 실행 함수의 본문이 더 명료하다고 생각하여 이렇게 했지만,

의견차는 있을 수 있다고 본다.

```ts
(async function asyncLoad(): Promise<void> {
  if (!hasLoader) setHasLoader(await setLoader());
})();
```

# 6.3 변수 추출하기 extract variable

## 1. before

```ts
const LINKS = [
  { href: "basic", name: "Basic Viewer" },
  { href: "multi-frame", name: "MultiFrame Viewer" },
  { href: "error", name: "Error" },
  { href: "progress", name: "Progress" },
  { href: "http-header", name: "Http header" },
  { href: "viewport", name: "Viewport" },
  { href: "overlay", name: "Overlay" },
  { href: "overlay-event", name: "Overlay Event" },
];

function App() {
  return (
    <Heading as="h2">
      {
        LINKS.filter((link) => link.href === router.pathname.slice(1))?.[0]
          ?.name
      }
    </Heading>
  );
}
```

## 2. after

```ts
const LINKS = [
  { href: "basic", title: "Basic Viewer" },
  { href: "multi-frame", title: "MultiFrame Viewer" },
  { href: "error", title: "Error" },
  { href: "progress", title: "Progress" },
  { href: "http-header", title: "Http header" },
  { href: "viewport", title: "Viewport" },
  { href: "overlay", title: "Overlay" },
  { href: "overlay-event", title: "Overlay Event" },
];

const title = LINKS.filter(
  (link) => link.href === router.pathname.slice(1)
)?.[0]?.title;

function App() {
  return <Heading as="h2">{title}</Heading>;
}
```

# 6.4 변수 인라인하기 inline variable

## 1. before

변수명보다 코드가 더 쉽다.

```ts
const progressStatus = Math.round(progress.percent * 100);
loadingProgressMessage.sendMessage(progressStatus);
```

## 2. after

```jsx
loadingProgressMessage.sendMessage(Math.round(progress.percent * 100));
```

# 6.5 함수 선언 바꾸기 change function declaration

## 1. before

```ts
function useLoadImage() {
	// 이미지 로더를 로드한 후, 이미지를 load, display 처리
}

function App() {
	useCornerstone(element) // cornerstone.js 활성화
	useLoadImage(...)
}
```

## 2. after

useCornerstone()와 일관성을 맞춘다.

이미지 로더를 사용한다는 이름이 의미에 더 맞는다고 생각한다.

```ts
function useImageLoader() {
	// 이미지 로더를 로드한 후, 이미지를 load, display 처리
}

function App() {
	useCornerstone(element) // cornerstone.js 활성화
	useImageLoader(...)
}
```

# 6.6 변수 캡슐화 하기 encapsulate variable

cornerstone.js에서 뷰포트를 가져오기/설정하기 예

```ts
cornerstone.getViewport(element);
cornerstone.setViewport(element, viewport);
```

insight-viewer 프로젝트에서는 cornerstone.js api 호출을 한 군데에서 관리하기 위해 cornerstoneHelper를 만들었다. 여기에서 cornerstone.js api를 그대로 따른다.

```ts
export function getViewport(
  element: HTMLDivElement
): cornerstone.Viewport | undefined {
  return cornerstone.getViewport(element);
}

export function setViewport(
  element: HTMLDivElement,
  viewport: cornerstone.Viewport
): ReturnType<typeof cornerstone.setViewport> {
  return cornerstone.setViewport(element, viewport);
}
```

cornerstone.js의 getViewport, setViewport이 필요한 코드에서 이렇게 사용한다.

```ts
import {
  getViewport,
  setViewport,
  CornerstoneViewport,
} from '../../utils/cornerstoneHelper'

function updateViewport(element: Element, value: Partial<Viewport>) {
  const viewport = getViewport(<HTMLDivElement>element) as CornerstoneViewport

  if (viewport)
    setViewport(
      <HTMLDivElement>element,
      formatCornerstoneViewport(viewport, value)
    )
}
```

# 6.7 변수 이름 바꾸기 rename variable

## 1. before

원래 컨텍스트가 하나 있었는데, 뷰포트 컨텍스트가 추가되면서 이 이름이 애매모호하다.

```ts
const Context = createContext < ContextProp > ContextDefaultValue;
```

## 2. after

이 패키지의 이름에 loader가 들어갈지 viewer가 들어갈지 모르겠는데, 아무튼 현재는 이렇게.

```jsx
const LoaderContext = createContext < ContextProp > ContextDefaultValue;
```

# 6.8 매개변수 객체 만들기 introduce parameter object

## 1. before

```ts
async function useDICOMImageLoader(imageId: string): Promise<void> {
  // ...
}
```

## 2. after

매개변수가 둘 이상이면 객체로 만들어 사용한다.

```ts
interface Prop {
	imageId: string
  element: HTMLDivElement | null
	isSingleImage: boolean
}

async function useDICOMImageLoader({
	imageId,
	element,
	isSingleImage
}: Prop): Promise<void> {
	// ...
}
```

# 6.9 여러 함수를 클래스로 묶기 combine functions into class

공통 데이터를 중심으로 긴밀하게 엮여 작동하는 함수 무리

## 1. before

```ts
interface Vec2 {
  x: number
  y: number
}

function subtract(vec1: Vec2, vec2: Vec2) {
  return {
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y,
  };
}

function length(vec: Vec2) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function normalize(vec: Vec2) {
  let len = length(vec);
  if (len > 0) {
    len = 1 / len;
  }
  return {
    x: vec.x * len,
    y: vec.y * len,
  };
}

// ...

const width = window.innerWidth;
const height = window.innerHeight;
const v1 = { x: width / 2 - 50, y: height / 2 - 50 };
const v2 = { x: width / 2 + 50, y: height / 2 + 50 };
const v3 = normalize(subtract(v1, v2));
// ...
```

## 2. after

```ts
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  subtract(vec) {
    return new Vec2(this.x - vec.x, this.y - vec.y);
  }

  get normalize() {
    var len = this.length;
    if (len > 0) {
      len = 1 / len;
    }
    return new Vec2(this.x * len, this.y * len);
  }

  // ...
}

const width = window.innerWidth;
const height = window.innerHeight;
const v1 = new Vec2(width / 2 - 50, height / 2 - 50);
const v2 = new Vec2(width / 2 + 50, height / 2 + 50);
const v3 = v1.subtract(v2).normalize;
new Rectangle(new Vec2(width / 2, 0), width, 3, 0)
// ...
```

타입스크립트 및 es 모듈 덕분에 클래스 없이도 간결하게 코드를 작성할 수 있고,
pipe 등을 사용하면 중첩 함수로 인한 복잡함도 해소할 수 있으니 취향에 따라 선택하겠지만,
벡터, 도형 등 관련 메서드를 클래스로 묶어서 사용하는 게 더 간편하다고 생각되는 경우가 있다.

# 6.10 여러 함수를 변환 함수로 묶기 combine functions into transform

도출 로직 반복 방지

```ts
function vecUtil(vec: Vec2) {
  const v = { ...vec };
  v.length = Math.sqrt(v.x * v.x + v.y * v.y);
  const magnitude = v.length > 0 ? 1 / v.length : v.length;
  v.normalize = {
    x: v.x * magnitude,
    y: v.y * magnitude
  }
  return v
}
const v5 = vecUtil({ x: -100, y: -100 });
/* {
  x: -100,
  y: -100,
  length: 141.4213562373095,
  normalize: {
    x: -0.7071067811865476,
    y: -0.7071067811865476
  }
}
*/
```

# 6.11 단계 쪼개기 split phase

```ts
export function DICOMImageViewer({
  // ...
}): JSX.Element {
  // ...
  useCornerstone(elRef.current)                     // 1. cornerstone.js enable
  useImageLoader({                                  // 2. cornerstoneWADOImageLoader 로드/등록 및 이미지 로드/디스플레이
    imageId,
    element: elRef.current,
    onError,
    requestInterceptor,
    setLoader: () => setWadoImageLoader(onError),
    initialViewportRef,
    onViewportChange,
  })
  useViewportUpdate(elRef.current, viewport)         // 3. 뷰포트 처리
  useViewportInteraction(elRef.current, interaction) // 4. 뷰포트 인터랙션 처리

  return (
    <ViewerWrapper ref={elRef} Progress={Progress}>
      {children}
    </ViewerWrapper>
  )
}
```
