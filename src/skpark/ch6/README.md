# 6.1 함수 추출하기 extract function

## 1. before

useMultiframe.ts

```jsx
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

```jsx
export function curriedUseMultiframe(
  images: string[]
): ReturnCurriedUseMultiframe {
  return (initial = 0) => useMultiframe({ images, initial });
}
```

useMultiframe 사용 사례는 이렇다.

```jsx
const { frame, setFrame } = useMultiframe();
```

prefetch 처리는 암묵적으로 발생하며, frame 처리 관련 속성을 export 하고 있다.

useMultiframe이란 이름은 애매모호한 면이 있다.

## 2. after

이를 usePrefetch와 useFrame으로 분리하여, 용도에 따라 사용하기

usePrefetch.ts

```jsx
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

```jsx
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

```jsx
function DICOMImagesViewer({ imageId, images }) {
  usePrefetch(images);
  // ...
}
```

컴퍼넌트에서 현재 프레임을 가져오거나 설정할 수 있다.

```jsx
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

```jsx
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

```jsx
(async function asyncLoad(): Promise<undefined> {
  if (hasLoader) return undefined;
  setHasLoader(await setLoader());
  return undefined;
})();
```

# 6.3 변수 추출하기 extract variable

## 1. before

```jsx
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

```jsx
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

```jsx
const progressStatus = Math.round(progress.percent * 100);
loadingProgressMessage.sendMessage(progressStatus);
```

## 2. after

```jsx
loadingProgressMessage.sendMessage(Math.round(progress.percent * 100));
```

# 6.5 함수 선언 바꾸기 change function declaration

## 1. before

```jsx
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

```jsx
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

```jsx
cornerstone.getViewport(element);
cornerstone.setViewport(element, viewport);
```

insight-viewer 프로젝트에서는 cornerstone.js api 호출을 한 군데에서 관리하기 위해 cornerstoneHelper를 만들었다. 여기에서 cornerstone.js api를 그대로 따른다.

```jsx
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

```jsx
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

```jsx
const Context = createContext < ContextProp > ContextDefaultValue;
```

## 2. after

이 패키지의 이름에 loader가 들어갈지 viewer가 들어갈지 모르겠는데, 아무튼 현재는 이렇게.

```jsx
const LoaderContext = createContext < ContextProp > ContextDefaultValue;
```

# 6.8 매개변수 객체 만들기 introduce parameter object

## 1. before

```jsx
async function useDICOMImageLoader(imageId: string): Promise<void> {
  // ...
}
```

## 2. after

매개변수가 둘 이상이면 객체로 만들어 사용한다.

```jsx
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
