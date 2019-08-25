# Seoa.Commands

## Seoa.Commands.inf
**서아봇**의 커맨드를 담당하는 커맨드 집합 폴더입니다.

## Seoa.Commands.list
음악 관련 커맨드
- m_native.js
  - 이 파일은 classes/music_native.js, classes/search.js와 연계되는 커맨드 파일 입니다.
  - 이 파일 또는 연계되는 파일을 임의로 수정하면 음악 커맨드가 작동하지 않을 수 있습니다.

- m_lavalink.js
  - 이 파일은 classes/music_lavalink.js와 연계되는 커맨드 파일 입니다.
  - 이 파일 또는 연계되는 파일을 임의로 수정하면 음악 커맨드가 작동하지 않을 수 있습니다.

- mylist.js
  - 이 파일은 classes/search.js와 연계되는 커맨드 파일입니다.
  - 이 파일 또는 연계되는 파일을 임의로 수정하면 마이리스트 커맨드가 작동하지 않을 수 있습니다.

오락 관련 커맨드
- quiz.js
  - 이 파일은 QuizData/quizs.json와 연계되는 커맨드 파일 입니다.
  - 이 파일 또는 연계되는 파일을 임의로 수정하면 퀴즈 커맨드가 작동하지 않을 수 있습니다.

- point.js
  - 이 파일은 **실제로 아무런 기능을 하지 않는** 커맨드 파일 입니다.
  - help 커맨드에 표시를 하기 위한 더미 파일입니다.
  
- leaderboard.js
  - 이 파일은 퀴즈 커맨드로 얻은 포인트를 집계해 랭킹을 나열하는 커맨드 파일입니다.
  - 이 파일을 임의로 수정하면 랭킹 커맨드가 작동하지 않을 수 있습니다.

## Seoa.Commands.howToWrite
서아봇의 커맨드를 작성하는 요령입니다.

1. 더미 파일이 아닌 이상 **exports.run**(을)를 무조건 작성하셔야 합니다.
    
    위의 point.js처럼 도움말 커맨드에 표시를 위해 더미 파일을 만들지 않는 이상
    
    `seoa, msg, query` 를 인수로 받는 함수로 만드셔야 작동합니다.
   
2. **exports.callName**도 String[Array] 형식으로 작성하셔야 합니다.

    exports.callName 객체가 String[Array] 형태로 존재하여야 커맨드를 정상적으로 불러올 수 있습니다.

3. **exports.helps**는 필수 작성사항이 아닙니다.

    help 커맨드에 봇 소유자를 위하여 exports.helps.description에 아무런 값이 없으면 표시가 안되게 설계가 되어 있습니다.

    따라서 help 커맨드에 표시를 하고 싶다면 JSON 형식, description와 uses 키를 할당하셔야 합니다.

    봇 소유자 전용 커맨드로 만드시려면 **chkOwner** 키를 추가하시고 true 값을 할당하셔야 합니다.

    서버 관리자 전용 커맨드로 만드시려면 **permission** 키를 추가하시고 디스코드에서 제공하는 flag를 할당하셔야 합니다.

## Seoa.Commands.warning
- 커맨드를 추가하거나 삭제할 때 index.js도 같이 변동 사항을 반영을 해주어야 정상적으로 서아봇이 작동할 수 있습니다.

- 모든 커맨드 파일은 classes/seoa.js와 연계됩니다.