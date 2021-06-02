// 리팩토링
// 1. 유효범위를 벗어나는 변수가 없을 때

function printOwing(invoice) {
  let outstanding = 0;

  printBanner();

  // 미해결 채무(outstanding)을 계산한다.
  for (const o of invoice.orders) {
    outstanding += o.amount;
  }

  // 마감일(dueDate)을 기록한다.
  // const today = Clock.today;
  // invoice.dueDate = new Date(
  //   today.getFullYear(),
  //   today.getMonth(),
  //   today.getDate() + 30
  // );
  // 예제는 위처럼 되어 있으나 테스트하기 편하게 임의로 변환

  invoice.dueDate = new Date();

  printDetail();

  function printDetail() {
    // 세부 사항을 출력한다.
    console.log(`고객명: ${invoice.customer}`);
    console.log(`채무액: ${outstanding}`);
    console.log(`마감일: ${invoice.dueDate.toLocaleDateString()}`);
  }
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
