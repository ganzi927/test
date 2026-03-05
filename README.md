# AI Stock Portfolio Analyst 📈

본 프로젝트는 최신 뉴스 헤드라인을 수집하고 Google의 Gemini AI 모델을 활용해 주석 및 분석 리포트를 작성하는 **AI 기반 주식 포트폴리오 관리자** 웹 애플리케이션입니다.

## ✨ 주요 기능
- 📰 **뉴스 자동 스크래핑**: 브리스킨(Briskeen)에서 오늘의 주요 헤드라인을 실시간으로 가져옵니다.
- 🤖 **AI 종목 분석**: Gemini 2.5 Flash 모델과 구글 검색(Google Search Grounding)을 결합하여 가상의 주식을 배제한 100% 실제 상장 주식(KOSPI, KOSDAQ) 기반의 날카로운 분석을 수행합니다.
- 📊 **포트폴리오 테이블 렌더링**: 각 종목별 `현재가`, `1·2차 목표가/손절가`, `괴리율`, `트리거 요소` 등을 보기 쉽게 표 형태로 갱신합니다. (상태: 신규편입/보유/관망/매도권고/제외)
- 💱 **실시간 경제 위젯 (환율 및 유가)**: 우측 상단 메인 위젯을 통해 최신 원/달러 환율 및 WTI 유가 정보를 한눈에 확인할 수 있습니다.
- 📉 **플로팅 기술적 분석기 (Technical Analyzer)**: 화면 우측 하단의 플로팅 버튼을 클릭해 특정 종목을 입력하면, 즉시 구글 수급 현황을 분석하여 상세한 기술적 매수/매도 타점을 1차/2차로 나눈 마크다운 리포트를 제공받습니다.
- 🗄️ **DB 자동 동기화**: 분석된 데이터는 Supabase와 즉시 연동되어 백엔드 저장소에 반영됩니다.

## 🛠️ 기술 스택
- **Framework**: Next.js (App Router)
- **Frontend**: React, TypeScript, Mantine UI
- **Backend / API**: Next.js Route Handlers
- **Database**: Supabase
- **AI / Scraper**: Google Generative AI (Gemini), Cheerio 웹 스크래퍼

## 🚀 시작하기

### 1️⃣ 패키지 설치
\`\`\`bash
npm install
\`\`\`

### 2️⃣ 환경 변수 설정 (\`.env.local\`)
프로젝트 루트 디렉토리에 \`.env.local\` 파일을 생성하고 다음 키 값들을 입력하세요.
\`\`\`env
# Gemini API
GEMINI_API_KEY="본인의_GEMINI_API_KEY"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="본인의_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="본인의_SUPABASE_ANON_KEY"
\`\`\`

### 3️⃣ Supabase 스키마 구성
\`supabase/migrations/0000_portfolio_schema.sql\` 경로에 있는 쿼리를 본인의 Supabase SQL 편집기에 실행하여 테이블과 권한(Row Level Security)을 초기화합니다.

### 4️⃣ 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`
브라우저에서 \`http://localhost:3000\`에 접속하여 포트폴리오 생성기와 플로팅 위젯을 만날 수 있습니다!
