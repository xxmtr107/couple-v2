// Internationalization (i18n) configuration
export type Language = 'vi' | 'en';

export const translations = {
    vi: {
        // Common
        loading: 'Đang tải...',
        save: 'Lưu',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        back: 'Quay lại',
        signOut: 'Đăng xuất',

        // Navbar
        ourStory: 'Câu chuyện',
        timeline: 'Dòng thời gian',
        couple: 'Cặp đôi',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',
        upload: 'Tải lên',
        daysTogether: 'ngày bên nhau',

        // Couple Page - Not Connected
        waitingTitle: 'Đang chờ nửa kia của bạn...',
        waitingSubtitle: 'Kết nối với người ấy để bắt đầu xây dựng album kỷ niệm chung.',
        yourInviteCode: 'Mã mời của bạn',
        shareCodeDesc: 'Chia sẻ mã này với người ấy để ghép đôi.',
        shareInvite: 'Chia sẻ mã mời',
        enterPartnerCode: 'Nhập mã của người ấy',
        enterCodeDesc: 'Có mã mời từ người ấy? Nhập vào đây.',
        codePlaceholder: 'VD: HEART-1234',
        connectNow: 'Kết nối ngay',
        copied: 'Đã copy mã mời! 📋',

        // Couple Page - Pending
        pendingTitle: 'Đang chờ phản hồi...',
        pendingSent: 'Bạn đã gửi lời mời đến',
        pendingWait: 'Hãy chờ người ấy xác nhận nhé! 💕',
        cancelInvite: 'Hủy lời mời',
        cancelHint: '(Hủy để gửi cho người khác)',

        // Couple Page - Connected
        connected: 'Đã kết nối!',
        daysTogetherLabel: 'ngày bên nhau',
        viewMemories: '📸 Xem kỷ niệm chung',
        uploadMemory: '📷 Thêm kỷ niệm mới',
        coupleSettings: '⚙️ Cài đặt cặp đôi',

        // Couple Requests
        pendingRequests: 'Yêu cầu kết nối đang chờ:',
        someoneWantsConnect: 'muốn kết nối với bạn',
        accept: 'Chấp nhận',
        reject: 'Từ chối',
        requestAccepted: 'Đã kết nối thành công! 💕',
        requestRejected: 'Đã từ chối yêu cầu.',

        // Gallery
        ourYearTogether: 'Năm tháng bên nhau',
        momentsOfLove: 'Khoảnh khắc yêu thương',
        uploadNewPhotos: '📸 Tải ảnh mới lên',
        noPhotosYet: 'Chưa có ảnh nào. Hãy tải lên kỷ niệm đầu tiên!',
        onThisDay: 'Ngày này năm xưa',

        // Upload
        uploadTitle: 'Tải lên kỷ niệm',
        selectFile: 'Chọn ảnh hoặc video',
        caption: 'Chú thích',
        captionPlaceholder: 'Viết gì đó về khoảnh khắc này...',
        tags: 'Thẻ',
        tagsPlaceholder: 'date, anniversary, travel...',
        mediaDate: 'Ngày chụp/quay',
        uploading: 'Đang tải lên...',
        uploadSuccess: 'Tải lên thành công! 🎉',
        uploadFailed: 'Tải lên thất bại!',

        // Profile
        profileTitle: 'Thông tin cá nhân',
        username: 'Tên đăng nhập',
        displayName: 'Tên hiển thị',
        email: 'Email',
        birthday: 'Ngày sinh',
        changeAvatar: 'Click để thay đổi avatar',
        saveChanges: '💾 Lưu thay đổi',
        saved: 'Đã lưu thông tin! 💕',
        saveFailed: 'Lưu thất bại, thử lại nhé!',

        // Settings
        settingsTitle: 'Cài đặt',
        theme: 'Giao diện',
        themeDefault: 'Mặc định',
        themePink: 'Hồng',
        themeBlue: 'Xanh',
        themeDark: 'Tối',
        language: 'Ngôn ngữ',
        notifications: 'Bật thông báo',
        dangerZone: '⚠️ Vùng nguy hiểm',
        breakupWarning: 'Hủy kết nối sẽ xóa toàn bộ dữ liệu chung. Hành động này không thể hoàn tác.',
        breakup: '💔 Hủy kết nối',
        breakupConfirm: 'Bạn có chắc chắn muốn hủy kết nối?',
        confirmBreakup: 'Xác nhận hủy',

        // Footer
        madeWithLove: 'Được tạo với 💕 cho các cặp đôi',
        allRightsReserved: 'Bản quyền thuộc về',

        // Auth
        login: 'Đăng nhập',
        register: 'Đăng ký',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        noAccount: 'Chưa có tài khoản?',
        hasAccount: 'Đã có tài khoản?',
    },
    en: {
        // Common
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        back: 'Back',
        signOut: 'Sign Out',

        // Navbar
        ourStory: 'Our Story',
        timeline: 'Timeline',
        couple: 'Couple',
        profile: 'Profile',
        settings: 'Settings',
        upload: 'Upload',
        daysTogether: 'days together',

        // Couple Page - Not Connected
        waitingTitle: 'Waiting for your better half...',
        waitingSubtitle: 'Connect with your partner to start building your memory timeline together.',
        yourInviteCode: 'Your Invite Code',
        shareCodeDesc: 'Share this code with your partner to sync your accounts.',
        shareInvite: 'Share Invite',
        enterPartnerCode: "Enter Partner's Code",
        enterCodeDesc: 'Have an invite code from your partner? Paste it here.',
        codePlaceholder: 'e.g. HEART-1234',
        connectNow: 'Connect Now',
        copied: 'Code copied! 📋',

        // Couple Page - Pending
        pendingTitle: 'Waiting for response...',
        pendingSent: 'You sent an invite to',
        pendingWait: 'Wait for them to accept! 💕',
        cancelInvite: 'Cancel Invite',
        cancelHint: '(Cancel to send to someone else)',

        // Couple Page - Connected
        connected: 'Connected!',
        daysTogetherLabel: 'days together',
        viewMemories: '📸 View Memories',
        uploadMemory: '📷 Add New Memory',
        coupleSettings: '⚙️ Couple Settings',

        // Couple Requests
        pendingRequests: 'Pending connection requests:',
        someoneWantsConnect: 'wants to connect with you',
        accept: 'Accept',
        reject: 'Reject',
        requestAccepted: 'Connected successfully! 💕',
        requestRejected: 'Request rejected.',

        // Gallery
        ourYearTogether: 'Our Year Together',
        momentsOfLove: 'Moments of Love & Memories',
        uploadNewPhotos: '📸 Upload New Photos',
        noPhotosYet: 'No photos yet. Upload your first memory!',
        onThisDay: 'On This Day',

        // Upload
        uploadTitle: 'Upload Memory',
        selectFile: 'Select photo or video',
        caption: 'Caption',
        captionPlaceholder: 'Write something about this moment...',
        tags: 'Tags',
        tagsPlaceholder: 'date, anniversary, travel...',
        mediaDate: 'Date taken',
        uploading: 'Uploading...',
        uploadSuccess: 'Upload successful! 🎉',
        uploadFailed: 'Upload failed!',

        // Profile
        profileTitle: 'Personal Information',
        username: 'Username',
        displayName: 'Display Name',
        email: 'Email',
        birthday: 'Birthday',
        changeAvatar: 'Click to change avatar',
        saveChanges: '💾 Save Changes',
        saved: 'Saved! 💕',
        saveFailed: 'Save failed, please try again!',

        // Settings
        settingsTitle: 'Settings',
        theme: 'Theme',
        themeDefault: 'Default',
        themePink: 'Pink',
        themeBlue: 'Blue',
        themeDark: 'Dark',
        language: 'Language',
        notifications: 'Enable notifications',
        dangerZone: '⚠️ Danger Zone',
        breakupWarning: 'Breaking up will delete all shared data. This action cannot be undone.',
        breakup: '💔 Break Up',
        breakupConfirm: 'Are you sure you want to break up?',
        confirmBreakup: 'Confirm Break Up',

        // Footer
        madeWithLove: 'Made with 💕 for couples',
        allRightsReserved: 'All rights reserved',

        // Auth
        login: 'Login',
        register: 'Register',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
    },
};

// Get current language from localStorage or default to Vietnamese
export const getCurrentLanguage = (): Language => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
};

// Set language
export const setLanguage = (lang: Language): void => {
    localStorage.setItem('language', lang);
    window.dispatchEvent(new Event('languageChange'));
};

// Get translation
export const t = (key: keyof typeof translations.vi): string => {
    const lang = getCurrentLanguage();
    return translations[lang][key] || translations.vi[key] || key;
};

// Hook for React components
import { useState, useEffect } from 'react';

export const useTranslation = () => {
    const [lang, setLang] = useState<Language>(getCurrentLanguage());

    useEffect(() => {
        const handleChange = () => setLang(getCurrentLanguage());
        window.addEventListener('languageChange', handleChange);
        return () => window.removeEventListener('languageChange', handleChange);
    }, []);

    const translate = (key: keyof typeof translations.vi): string => {
        return translations[lang][key] || translations.vi[key] || key;
    };

    return {
        t: translate,
        lang,
        setLang: (newLang: Language) => {
            setLanguage(newLang);
            setLang(newLang);
        },
    };
};
