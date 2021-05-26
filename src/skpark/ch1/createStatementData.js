export default function createStatementData(invoice, plays) { // 중간 데이터 생성 전담
  const result = {}
  result.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance) // 얕은 복사 수행
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
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

  get amount() {
    throw new Error('서브클래스에서 처리하도록 설계되었습니다.')
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0)
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch(aPlay.type) {
    case 'tragedy': return new TragedyCalculator(aPerformance, aPlay)
    case 'comedy': return new ComedyCalculator(aPerformance, aPlay)
    default: throw new Error(`unknown type: ${aPlay.type}`)

  }
  return new PerformanceCalculator(aPerformance, aPlay)
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }
    return result
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000
    if (this.performance.audience > 20) {
      result += 300 * this.performance.audience
    }
    return result
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}
