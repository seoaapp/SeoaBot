# Seoa.Classes

## Seoa.Classes.inf
**서아봇**의 일부 파일들을 구성하는 클래스 집합 폴더입니다.

## Seoa.Classes.list
핵심 클래스
- seoa.js
  - 이 파일은 **모든 파일**과 연계되어 봇을 구동하는데 큰 기여를 하는 클래스입니다.
  - 따라서 이 파일을 임의로 수정하면 서아봇이 작동하지 않습니다.

음악 관련 클래스
- search.js
  - 이 파일은 commands/m_native.js, classes/seoa.js와 연계되는 클래스 입니다.
  - 이 파일을 임의로 수정하면 음악 커맨드의 검색 기능이 작동하지 않을 수 있습니다.

- music_native.js
  - 이 파일은 commands/m_native.js, classes/seoa.js와 연계되는 클래스 입니다.
  - 이 파일을 임의로 수정하면 음악 커맨드를 사용할 수 없습니다.

- music_lavalink.js
  - 이 파일은 commands/m_lavalink.js, classes/seoa.js와 연계되는 클래스 입니다.
  - 이 파일을 임의로 수정하면 음악 커맨드를 사용할 수 없습니다.

## Seoa.Classes.warning
클래스를 추가하거나 삭제할 때 index.js도 같이 변동 사항을 반영을 해주어야 정상적으로 서아봇이 작동할 수 있습니다.