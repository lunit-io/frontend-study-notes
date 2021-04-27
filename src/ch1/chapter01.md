# Reactoring Chapter 1

## 리팩토링이란

리팩토링은 겉으로 드러나는 코드의 기능 (겉보기의 동작)은 바꾸지 않으면서 내부 구조를 개선하는 방식으로 소프트웨어 시스템을 수정하는 과정이다.

> 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩토링하고 나서 원하는 기능을 추가한다.

## 과정

0. 리팩토링하기 전에 제대로 된 테스트부터 마련
1. 원본 함수를 중첩 함수 여러개로 나누기
2. 계산코드와 출력 코드 분리 (단계 쪼개기)
3. 계산 로직 -> 다향성으로 표현 

<br />

## 0. 리팩토링 하기전 제대로 된 테스트부터 마련

아무리 간단한 수정이라도 리팩터링 후에는 항상 테스트하는 습관을 들이는 것이 바람직하다.
사람은 실수하기 마련이다.

리팩터링은 프로그램 수정을 작은 단계로 나눠 진행한다. 그래서 중간에 실수하더라도 버그를 쉽게 찾을 수 있다.

하나의 리팩터링을 문제없이 끝낼 때마다 커밋을 한다. 그래야 중간에 문제가 생기더라도 이전의 정상 상태로 쉽게 돌아갈 수 있다.

컴파일 -> 테스트 -> 커밋

변수의 이름이 바뀔 때마다 컴파일-테스트-커밋 

<br />

## 1. 원본 함수를 중첩 함수 여러개로 나누기

> 코드를 분석해서 얻은 정보는 휘발성이 높기로 악명 높은 저장 장치인 내 머릿속에 기록되므로, 잊지 않으려면 재빨리 코드에 반영해야 한다. 다시 분석하지 않아도 코드 스스로가 자신이 하는 일이 무엇인지 이야기 할 것이다.

추출한 함수내에서 변수명을 더 명확하게 변경한다. 매개변수에 이름에 접두어로 타입 이름을 적는데, ㅇ지금처럼 매개변수의 역할이 뚜렷하지 않을 때는 부정 관사(a/an)를 붙인다.

> 컴퓨터가 이해하는 코드는 바보도 작성할 수 있다. 사람이 이해할도록 작성하는 프로그래머가 진정한 실력자다.

<br />

### 임시 변수를 질의 함수로 바꾸기

임시 변수들 때문에 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 복잡해 지기 때문에 변경한다.

```diff
- const play = plays[perf.playID];
+ function playFor(aPerformance) {
+ 	return plays[aPerformance.playID];
+ }
+ const play = playFor(perf);
```

<br />

### 변수 인라인하기

```diff
- const play = playFor(perf);
+ let thisAmount = amountFor(perf, playFor(perf));
```

<br />

### 함수선언 바꾸기

```diff
- let thisAmount = amountFor(perf, playFor(perf));
+ let thisAmount = amountFor(perf);
- function amountFor(aPerformance, play) {
+ function amountFor(aPerformance) {
+ siwtch (playFor(aPerformance.type)) {
```

지역변수를 제거해서 얻는 가장 큰 장점은 추출 작업이 훨씬 쉬워진다는 것이다.

유효범위를 신경 써야 할 대상이 줄어들기 때문이다. 추출 작업 전에는 거의 항상 지역 변수부터 제거한다.

<br />

### 반복문 쪼개기

반복문의 중복은 성능에 미치는 영향이 미미할 때가 많다.

> 리팩터링으로 인한 성능 문제에 대한 내 조언은 '특별한 경우가 아니라면 일단 무시하라'는 것이다.

<br />

### 문장 슬라이드하기

변수 선언(초기화)을 반복문 앞으로 이동

```js
let volumeCredits = 0;
for (let perf of invoice.performances) {
  volumeCredits += volumeCreditsFor(perf);
}
```

<br />

## 2. 계산코드와 출력 코드 분리 (단계 쪼개기)

첫번째 단계에서 두번째 단계로 전달할 중간 데이터 구조를 생성한다.

```js
function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance); // 얕은 복사 수행
  return result;
}
```

매개변수로 건네 데이터를 수정하지 않는 편이다. 가변(mutable) 데이터는 금방 상하기 때문에 데이터를 최대한 불변(immutable) 처럼 취급한다.

<br />

**createStatementData.js**


```js
export default function createStatementData(invoice, plays) { 
  const result = {}
  result.customer = invoice.customer; 
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;
  // ...
}
```

**statement.js** 

```js
function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}
```

계산하는 부분과 출력하는 부분을 분리하여 모듈화하면 각 부분이 하는 일과 그 부분들이 맞물려 돌아가는 과정을 파악하기 쉬워진다. 모듈화 덕분에 계산 코드를 중복하지 않고도 HTML 버전을 만들 수 있다. 

<br />

## 4. 다형성을 활요해 계산 코드 재구성하기

연극 장르를 추가하고 장르마다 공연료와 적립 포인트 계산법을 다르게 지정하도록 기능을 수정해보자.

객체지향의 핵심 특성인 `다형셩(polymorphism)`을 활용하는 것

**상속 계층** 을 구성해서 희극 서브클래스와 비극 서브클래스가 각자의 구체적인 계산 로직을 정의하는 것 

<br />

### 로직을 클래스로 변경

최상위 클래스
```js
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
}
```

다형성을 지원하기 위해 클래스로 변경

<br />

### 생성자를 팩터리 함수로 바꾸기

**createStatementData 함수**

```diff
function enrichPerformance(aPerformance) {
-	const claculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
+ const claculater = const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
}
```

**최상위**

```js
function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
  
class TragedyCalculator extends PerformanceCalculator {
}
class ComedyCalculator extends PerformanceCalculator {
}
```

서브클래스를 사용하려면 생성자 대신 함수를 호출하도록 바꿔야 한다. 자바스크립트에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없기 때문이다.

<br />

### ### 조건부 로직을 다형성으로 바꾸기

```js
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error(`subclass responsibility`);
  }
}
```

amount를 삭제하지 않고 error처리하는 센스.. 👍

<br />

```js
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    // code
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
```

[**super**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/super) 키워드는 부모 오브젝트의 함수를 호출할 때 사용된다.

<br />

```js
 function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.amount = calculator.amount;
    // code
    return result;
  }
```

게터 메서드를 호출하는 코드와 일반적인 데이터 접근 코드의 모양이 똑같다. `calculator.amount`

계산기 인스턴스를 반환하는 방식과 각각의 출력 값으로 직접 계산하는 방식 중 하나를 선택할 때 나는 결과로 나온 데이터 구조를 누가 사용하는가를 기준으로 결정한다.

<br />

## 마무리

> 좋은 코드를 가늠하는 확실한 방법은 '얼마나 수정하기 쉬운가'다

리팩토링을 효과적으로 하는 핵심은, 단계를 잘게 나눠야 더 빠르게 처리할 수 있고, 코드는 절대 깨지지 않으며, 이러한 작은 단계들이 머여서 상당히 큰 변화를 이룰 수 있다는 사실을 깨닫는 것이다.

chapter 1의 내용은 clean architecture가 많이 생각나는 내용이었다.

그 책이 강조하는 

> 돌아는 가지만 수정이 불가능한 코드와 돌아가진 않지만 수정이 가능한 코드중 후자를 선택하겠다.

라는 대략 이런 뉘앙스의 글과 같은 맥락인거 같다.

실제로 코드를 작성하지는 않았는데, 이러한 경험이 없다보니 직접 시간내서 작생해도 좋았을 거 같다. 
