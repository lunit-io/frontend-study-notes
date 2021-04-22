export default function createStatementData(invoice, plays) { // 중간 데이터 생성 전담
  const result = {}
  result.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance) // 얕은 복사 수행
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
  
    if ('comedy' === aPerformance.play.type)
    result += Math.floor(aPerformance.audience / 5)
  
    return result
  }

  function totalAmount(data) {
    return data.performances
      .reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredits(data) {
    return data.performances
      .reduce((total, p) => total + p.volumeCredits, 0)
  }
}

// 공연료 계산기
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount() { // amountFor() 함수 코드를 계산기 클래스로 복사
    let result = 0
  
    switch(this.play.type) {
      case 'tragedy':
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 300 * this.performance.audience
        }
        break
      default:
        throw new Error(`unknown type: ${this.play.type}`)
    }
    return result
  }
}
