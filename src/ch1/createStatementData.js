export default function createStatementData(invoice, plays) { // 중간 데이터 생성 전담
  const result = {}
  result.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmount(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance)
    const result = Object.assign({}, aPerformance) // 얕은 복사 수행
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    let result = 0
  
    switch(aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 300 * aPerformance.audience
        }
        break
      default:
        throw new Error(`unknown type: ${aPerformance.play.type}`)
    }
    return result
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
  constructor(aPerformance) {
    this.performance = aPerformance
  }
}
