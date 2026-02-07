# 배포 가이드

GitHub Pages + GitHub Actions를 통해 배포됩니다.  
`config.js`는 Git에 포함되지 않으며, 배포 시 Secrets에서 자동 생성됩니다.

## GitHub Secrets 설정

**Settings → Secrets and variables → Actions → New repository secret**

### EmailJS
| Name | 설명 | 확인 위치 |
|------|------|-----------|
| `EMAILJS_PUBLIC_KEY` | Public Key | Integration → API Keys |
| `EMAILJS_SERVICE_ID` | Service ID | Email Services |
| `EMAILJS_TEMPLATE_ID` | Template ID | Email Templates |

### 회사 연락처
| Name | 설명 | 예시 |
|------|------|------|
| `COMPANY_PHONE` | 전화번호 | `02-1234-5678` |
| `COMPANY_FAX` | 팩스번호 | `02-1234-5679` |
| `COMPANY_EMAIL` | 이메일 | `info@daehyung.co.kr` |
| `COMPANY_ADDRESS` | 주소 | `서울특별시 강남구 테헤란로 123` |

## GitHub Pages 설정

1. **Settings → Pages → Source** → `GitHub Actions` 선택

## 배포 방법

`main` 브랜치에 push하면 자동 배포됩니다.

## 로컬 개발

```bash
cp js/config.example.js js/config.js
# config.js에 실제 값 입력 후 Live Server 등으로 실행
```

> `js/config.js`는 `.gitignore`에 포함되어 Git에 커밋되지 않습니다.
