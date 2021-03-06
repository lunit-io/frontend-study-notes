## Chapter 4 - 테스트 구축하기

- 리팩토링은 견고한 테스트 스위터 test suite 가 뒷받침되어야 한다.
- 테스트 코드 자체도 중요하지만 테스트를 자주 수행하는 습관도 버그를 찾는 도구가 된다.
- "테스트가 실패해야할 상황에서는 반드시 실패하게 만들자"
- 테스트는 public 메서드를 빠짐없이 테스트하는 방식이 아닌, 위험 요인을 중심으로 작성해야 한다.

  → 버그를 찾기 위해서 테스트를 작성하기 때문

- 테스트끼리 상호작용하게 하는 공유 픽스처를 생성하면 안됨
  - 가급적 매 테스트마다 새 픽스처(객체?)를 생성하는 것을 추천
- 의도의 범위를 벗어나는 경계 지점에서 어떤 오류가 발생할지 확인하는 테스트 작성하는게 좋다.
- 단위 테스트 unit test : 코드의 작은 영역만을 대상으로 빠르게 실행되도록 설계된 테스트.
- 단위테스트는 자가 테스트 코드의 핵심. 자가 테스트의 대부분이 단위 테스트.
- 테스트도 한 번에 완벽할 수 없으므로,
  - 반복적으로 테스트 진행
  - 지속적으로 테스트 보강
- **버그를 발견하는 즉시 발견한 버그를 명확히 잡아내는 테스트부터 작성.**
