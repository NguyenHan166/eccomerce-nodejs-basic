module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',  // Đặt nơi lưu báo cáo độ phủ
    coverageReporters: ['text', 'html'],
    collectCoverageFrom: [
      '!models/**/index.js',  // Loại trừ tệp không cần thiết
      '!node_modules/**',  // Loại trừ thư viện bên ngoài,
      '!jest.config.js',  // Loại trừ tệp cấu hình Jest
      '!coverage/**',  // Loại trừ thư mục báo cáo độ phủ
      '!utils/**',  // Loại trừ thư mục utils
    ],
  };
  