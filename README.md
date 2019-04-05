# Vanilla-Cloud

텍스트를 분석하여 시각화를 구현하는 과제

![VanillaCloud](/vanilla_cloud_video.gif)

![VanillaCloud](/vanilla_cloud_video2.gif)


## Setup

Install dependencies

```sh
$ yarn install (or npm install)
```

## Development

```sh
$ yarn dev (or npm run dev)
# visit http://localhost:8080
```

## Features

- 사용자가 텍스트를 입력 (영문만 지원, 5000자 이하)
- 텍스트가 5000자를 초과했을 경우, 사용자에게 글자수 초과에 대한 정보를 알려주고 텍스트 분석 하지 않음
- 사용자가 텍스트를 수정할 경우, 수정하는 동시에 분석 결과에 반영
- 사용자가 입력한 텍스트에서 사용된 **단어**들을 추출하여 분석, 중복 제거
- **추출한 단어들의 횟수**를 분석하여 사용자에게 시각화
- 켄바스를 통해 시각화
- 폰트 및 컬러 변경 가능
- 반응형 대응
