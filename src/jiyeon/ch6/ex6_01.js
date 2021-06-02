// 리팩토링
// 1. 유효범위를 벗어나는 변수가 없을 때
// 2. 지역 변수를 사용할 때
// 3. 지역변수의 값을 변경할 때

function printOwing(invoice) {
  printBanner();

  const outstanding = calculateOutstanding(invoice);

  // 마감일(dueDate)을 기록한다.
  // const today = Clock.today;
  // invoice.dueDate = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate() + 30
  // );
  // 예제는 위처럼 되어 있으나 테스트하기 편하게 임의로 변환

  recordDueDate(invoice);
  printDetail(invoice, outstanding);
}

function calculateOutstanding(invoice) {
  let result = 0;
  for (const o of invoice.orders) {
    result += o.amount;
  }
  return result;
}

function recordDueDate(invoice) {
  invoice.dueDate = new Date();
}

function printDetail(invoice, outstanding) {
  // 세부 사항을 출력한다.
  console.log(`고객명: ${invoice.customer}`);
  console.log(`채무액: ${outstanding}`);
  console.log(`마감일: ${invoice.dueDate.toLocaleDateString()}`);
}

function printBanner() {
  console.log("**** 고객 채무 ****");
}

// 테스트 데이터
const exInvoice = {
  customer: "Martin",
  orders: [{ amount: 100 }, { amount: 150 }],
};

printOwing(exInvoice);
