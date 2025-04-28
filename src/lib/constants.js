import { Env } from '@env';

export const LOCAL = 'local';

export const KEYCLOAK = {
  ISSUER: Env.KEYCLOAK_URL,
  CLIENT_ID: Env.KEYCLOAK_CLIENT_ID,
  TOKEN_ENDPOINT: `${Env.KEYCLOAK_URL}/protocol/openid-connect/token`,
  END_SESSION_ENDPOINT: `${Env.KEYCLOAK_URL}/protocol/openid-connect/logout`,
  USERINFO_ENDPOINT: `${Env.KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
  REDIRECT_URI: `${Env.SCHEME}://auth/login`,
  TOKEN: 'keycloak_token',
  USER_INFO: 'keycloak_user_info',
  USER_PERMISSIONS: 'keycloak_user_permissions',
};

export const BASE_AUTH = {
  TOKEN: 'auth_token',
  USER_INFO: 'auth_user_info',
  REFRESH_TOKEN_ENDPOINT: `${Env.API_URL}nt-app-bacsi/auth/refresh_token`,
  USERINFO_ENDPOINT: `${Env.API_URL}nt-app-bacsi/customers`,
};

export const IS_FIRST_TIME = 'is_first_time';

export const SELECTED_THEME = 'selected_theme';

export const DATE_FORMAT = {
  LONG: 'DD MMMM,YYYY [at] LTS',
  DATE: 'DD MMM YYYY',
  SHORT: 'DD/MM/YYYY',
  ID: 'YYYYMMDD',
  ID2: 'DDMMYYYY',
  ID3: 'YYYYMMDDHHmmss',
  ID4: 'DD-MM-YYYY',
  INPUT: 'YYYY-MM-DD',
  LL_SHORT: 'll',
  SHORT_TIME: 'DD/MM/YYYY HH:mm',
  FULL_TIME: 'DD-MM-YYYY HH:mm',
  FULL_DATE_TIME_SECOND_ZERO: 'DD/MM/YYYY HH:mm:00',
  FULL_DATE_TIME_DASH: 'DD/MM/YYYY HH:mm:ss',
  DATETIME_SECOND: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  FULL_YEAR_DATE_TIMEZONE: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  ISO_8601_WITHOUT_TIMEZONE: 'YYYY-MM-DDTHH:mm:ss',
  MONTH: 'MM/YYYY',
  SHORT_YEAR: 'YYYY/MM/DD',
};

export const UNIT_NAME_2_CODE = [
  { name: 'cái', id: 4 },
  { name: 'cây', id: 1003 },
  { name: 'cuộn', id: 12 },
  { name: 'hộp', id: 1 },
  { name: 'chiếc', id: 5 },
  { name: 'bộ', id: 1011 },
  { name: 'lốc', id: 10 },
  { name: 'gói', id: 14 },
  { name: 'bình', id: 1013 },
  { name: 'chai', id: 6 },
  { name: 'lọ', id: 7 },
  { name: 'quyển', id: 1016 },
  { name: 'thùng', id: 17 },
  { name: 'túi', id: 21 },
  { name: 'đôi', id: 18 },
  { name: 'ống', id: 15 },
  { name: 'bịch', id: 9 },
];

export const GUIDE_LINE = [
  {
    // title: 'Your current version is outdated. Please update to continue using.',
    title:
      'Phiên bản hiện tại của bạn đã lỗi thời. Vui lòng cập nhật để tiếp tục sử dụng.',
  },
  {
    // title: 'Take a screenshot containing the QR code.',
    title: 'Chụp ảnh màn hình có chứa mã QR',
  },
];

export const GUIDE_LINE_IOS = [
  {
    // title: 'To scan a QR code from a photo on your iPhone',
    title: 'Quét mã QR từ ảnh trên iPhone của bạn.',
  },
  {
    // title:
    //   '1. Open the Photos app: Navigate to the Photos app on your iPhone.',
    title:
      '1. Mở ứng dụng Ảnh: Điều hướng đến ứng dụng Ảnh trên iPhone của bạn.',
  },
  {
    // title:
    //   '2. Select the image: Find and open the picture containing the QR code.',
    title: '2. Chọn hình ảnh: Tìm và mở bức ảnh có chứa mã QR.',
  },
  {
    // title:
    //   '3.Tap and hold: Tap and hold your finger on the QR code within the image.',
    title:
      '3. Nhấn và giữ: Nhấn và giữ ngón tay của bạn lên mã QR trong hình ảnh.',
  },
  {
    // title:
    //   '4. Choose "Open in Safari": A menu will appear with options. Tap on "Open in Safari" to access the link associated with the QR code. ',
    title:
      '4. Chọn "Mở bằng Safari": Một menu sẽ xuất hiện với các tùy chọn. Nhấn vào "Mở bằng Safari" để truy cập liên kết liên kết với mã QR.',
  },
];

export const GUIDE_LINE_ANDROID = [
  {
    // title:
    //   'To scan a QR code from an image on an Android phone, you can use either the built-in Google Lens Google Lens feature.',
    title:
      'Để quét mã QR từ hình ảnh trên điện thoại Android, bạn có thể sử dụng tính năng Google Lens được tích hợp sẵn.',
  },

  {
    // title:
    //   '1. Open the image: Open the image containing the QR code in either Google Photos or your phone's Gallery app.',
    title:
      '1. Mở hình ảnh: Mở hình ảnh có chứa mã QR trong ứng dụng Google Photos hoặc Thư viện (Gallery) trên điện thoại của bạn.',
  },
  {
    // title:
    //   '2. Activate Lens: In Google Photos, tap the Lens icon (often a lens or magnifying glass). In Gallery, you may need to share the image and select "Google Search Image" or tap the "Lens" option, depending on your phone and app.',
    title:
      '2. Kích hoạt Lens: Trong Google Photos, nhấn vào biểu tượng Lens (thường là hình ống kính hoặc kính lúp). Trong ứng dụng Thư viện, bạn có thể cần chia sẻ hình ảnh và chọn "Tìm kiếm hình ảnh trên Google" hoặc nhấn vào tùy chọn "Lens", tùy thuộc vào điện thoại và ứng dụng của bạn.',
  },
  {
    // title:
    //   '3. Scan the QR code: Google Lens will automatically analyze the image and identify any QR codes. Follow any on-screen prompts to access the information.',
    title:
      '3. Quét mã QR: Google Lens sẽ tự động phân tích hình ảnh và nhận diện bất kỳ mã QR nào. Làm theo các hướng dẫn trên màn hình để truy cập thông tin.',
  },
];
