# 이미지 디렉터리 가이드

## 디렉터리 구조
```
images/
├── hero/           # 히어로 섹션 이미지 (메인 배너)
├── technology/     # 기술 섹션 이미지
├── products/       # 제품 이미지
├── applications/   # 적용 분야 이미지
└── common/         # 공통 이미지 (로고 등)
```

## 권장 이미지 사양
- **Hero 이미지**: 1920x1080px 이상, JPG/WebP
- **Technology 이미지**: 1200x800px, JPG/WebP
- **Products 이미지**: 800x800px (정사각형), PNG (투명 배경 권장)
- **Applications 이미지**: 1200x800px, JPG/WebP
- **Common 이미지**: 로고는 SVG 권장

## 무료 샘플 이미지 소스

### 추천 무료 이미지 사이트
1. **Unsplash** - https://unsplash.com
2. **Pexels** - https://pexels.com
3. **Pixabay** - https://pixabay.com

### 대형산업 웹사이트용 추천 검색어
- `seismometer` - 지진계
- `scientific equipment` - 과학 장비
- `earthquake monitoring` - 지진 모니터링
- `precision instrument` - 정밀 기기
- `laboratory technology` - 실험실 기술
- `geophysics` - 지구물리학
- `infrastructure monitoring` - 인프라 모니터링

### 직접 사용 가능한 무료 이미지 URL (Unsplash)

#### Hero 섹션용
- 기술/과학: https://unsplash.com/photos/white-microscope-on-top-of-black-table-yD5rv8_WzxA
- 데이터 분석: https://unsplash.com/photos/turned-on-monitoring-screen-hpjSkU2UYSU
- 연구소: https://unsplash.com/photos/person-in-white-long-sleeve-shirt-using-macbook-pro-L7en7Lb-Ovc

#### Technology 섹션용
- 회로/기술: https://unsplash.com/photos/black-and-green-computer-ram-stick-FO7JIlwjOtU
- 연구 장비: https://unsplash.com/photos/person-holding-laboratory-flasks-bvkLcBgjWXE

#### Products 섹션용
- 정밀 기기: https://unsplash.com/photos/person-holding-black-and-white-round-ornament-J_GH9-9aFYQ

#### Applications 섹션용
- 인프라: https://unsplash.com/photos/orange-and-blue-crane-under-blue-sky-during-daytime-jXa2dGqGoxk
- 건설/모니터링: https://unsplash.com/photos/an-aerial-view-of-a-bridge-over-a-body-of-water-kDvKHTqJJMk

## 이미지 다운로드 방법

### 방법 1: 웹사이트에서 직접 다운로드
1. 위 링크 클릭
2. 이미지 페이지에서 "Download" 버튼 클릭
3. 적절한 폴더에 저장

### 방법 2: PowerShell 스크립트 (영문 경로 필요)
```powershell
# 영문 경로에서만 작동
$urls = @{
    "hero-1.jpg" = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80"
    "tech-1.jpg" = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
    "product-1.jpg" = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80"
}

foreach ($item in $urls.GetEnumerator()) {
    Invoke-WebRequest -Uri $item.Value -OutFile $item.Key
}
```

## 이미지 사용 시 주의사항
- 모든 이미지는 **흰색 배경** 테마에 어울려야 함
- 고해상도, 전문적인 이미지만 사용
- 스톡 이미지 클리셰 피하기
- 저채도, 미니멀한 분위기 유지
