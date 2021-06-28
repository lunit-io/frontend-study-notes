# 7.1 레코드 캡슐화하기 encapsulate record

## 1. before

```ts
let data = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};

input.addEventListener('change', (e) => {
  data.c = e.target.value
  textEl.textContent = JSON.stringify(data)
})

button.addEventListener('click', (e) => {
  data.b = undefined
  textEl.textContent = JSON.stringify(data)
})
```

## 2. after

리액트 없이 vanilla 자바스크립트만 사용할 때,
변수를 업데이트를 직접 하는 대신 getter, setter로 처리하는 예.
더미 코드입니다.

```ts
interface Data {
  ...
}

function useState(initial: Data) {
  let value = { ...initial };
  const getState = () => value;
  const setState = (newValue: Partial<Data>) => (value = { ...value, ...newValue });
  return { getState, setState };
}

const { getState, setState } = useState(data);

input.addEventListener('change', (e) => {
  setState({
    c: e.target.value
  })
  textEl.textContent = JSON.stringiry(getState())
})

button.addEventListener('click', (e) => {
  setState({
    b: undefined
  })
  textEl.textContent = JSON.stringiry(getState())
})
```

# 7.2 컬렉션 캡슐화하기 encapsulate collection

좋은 사례인지는 모르겠다. 실제로 클래스보다는 함수를 사용해 캡슐화를 하는 경우가 많아서 이런 예제를 생각해보았다.

```ts
function useState(initial: Array<number>) {
  let value = [...initial];
  const getState = () => value;
  const setState = (newValue) => (value = value.concat(newValue));
  return { getState, setState };
}
```

# 7.3 기본형을 객체로 바꾸기 replace primitive with object

단순한 출력 이상의 기능이 필요할 때.

```ts
function hexUtil(hex: string) {
  return {
    toRGB,
    toHSL,
    lighterThan: (otherHex) => { /* boolean */ }
  }
}
```

# 7.4 임시 변수를 질의 함수로 바꾸기 replace temp with Query

7.1 레코드 캡슐화하기 encapsulate record의 getState()


# 7.5 클래스 추출하기 extract class

## 1. before
```ts
class BlogPost {
  private _previewTextRst: string
  private _priviewTextHtml: string
  private _textRst: string
  private _textHtml: string

  public set previewText(rst: string, html: string) {
    this._previewTextRst = rst
    this._priviewTextHtml = html
  }

  public set text(rst: string, html: string) {
    this._textRst = text
    this._textHtml = html
  }
}
```

## 2. after
```ts
class Text {
  private _rst: string
  private _html: string

  constructor(rst: string, html: string) {
    this._rst = rst
    this._html = html
  }

  public get rst() {
    return this._rst
  }

  public get html() {
    return this._html
  }
}

class BlogPost {
  private _previewText: string
  private _text: string

  public set previewText(rst: string, html: string) {
      this._previewText = new Text(rst, html)
  }

  public set text(rst: string, html: string) {
    this._text = new Text(rst, html)
  }
}
```

# 7.7 위임 숨기기 hide delegate

 cornerstone.displayImage, cornerstone.getDefaultViewportForImage를 위임하는 displayImage 메서드.
 api 사용자는 cornerstone을 신경쓰지 않아도 된다.

```ts
export function displayImage(
  element: HTMLDivElement,
  image: cornerstone.Image
): {
  viewport: CornerstoneViewport
  image: CornerstoneImage
} {
  const viewport = cornerstone.getDefaultViewportForImage(element, image)
  cornerstone.displayImage(element, image, viewport)

  return {
    viewport,
    image,
  }
}

displayImage(<HTMLDivElement>element, image)
```
