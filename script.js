class DateCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setActiveMode('mode1');
    }

    initializeElements() {
        this.mode1Btn = document.getElementById('mode1-btn');
        this.mode2Btn = document.getElementById('mode2-btn');
        this.mode3Btn = document.getElementById('mode3-btn');
        this.mode1Content = document.getElementById('mode1');
        this.mode2Content = document.getElementById('mode2');
        this.mode3Content = document.getElementById('mode3');
        this.daysInput = document.getElementById('days-input');
        this.dateInput = document.getElementById('date-input');
        this.startDateInput = document.getElementById('start-date-input');
        this.endDateInput = document.getElementById('end-date-input');
        this.westernDate = document.getElementById('western-date');
        this.japaneseDate = document.getElementById('japanese-date');
        this.daysResult = document.getElementById('days-result');
        this.targetDateDisplay = document.getElementById('target-date-display');
        this.daysBetweenResult = document.getElementById('days-between-result');
        this.dateRangeDisplay = document.getElementById('date-range-display');
    }

    bindEvents() {
        this.mode1Btn.addEventListener('click', () => this.switchMode('mode1'));
        this.mode2Btn.addEventListener('click', () => this.switchMode('mode2'));
        this.mode3Btn.addEventListener('click', () => this.switchMode('mode3'));
        
        this.daysInput.addEventListener('input', () => this.calculateFutureDate());
        this.dateInput.addEventListener('input', () => this.calculateDaysToDate());
        this.startDateInput.addEventListener('input', () => this.calculateDaysBetween());
        this.endDateInput.addEventListener('input', () => this.calculateDaysBetween());
        
        this.dateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
        
        this.startDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
        
        this.endDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
    }

    switchMode(mode) {
        // すべてのボタンとコンテンツからactiveクラスを削除
        this.mode1Btn.classList.remove('active');
        this.mode2Btn.classList.remove('active');
        this.mode3Btn.classList.remove('active');
        this.mode1Content.classList.remove('active');
        this.mode2Content.classList.remove('active');
        this.mode3Content.classList.remove('active');
        
        // 選択されたモードにactiveクラスを追加
        if (mode === 'mode1') {
            this.mode1Btn.classList.add('active');
            this.mode1Content.classList.add('active');
        } else if (mode === 'mode2') {
            this.mode2Btn.classList.add('active');
            this.mode2Content.classList.add('active');
        } else if (mode === 'mode3') {
            this.mode3Btn.classList.add('active');
            this.mode3Content.classList.add('active');
        }
    }

    setActiveMode(mode) {
        this.switchMode(mode);
    }

    calculateFutureDate() {
        const days = parseInt(this.daysInput.value);
        
        if (isNaN(days) || days < 0) {
            this.westernDate.textContent = '-';
            this.japaneseDate.textContent = '-';
            return;
        }

        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + days);

        this.westernDate.textContent = this.formatWesternDate(futureDate);
        this.japaneseDate.textContent = this.formatJapaneseDate(futureDate);
    }

    calculateDaysToDate() {
        const dateStr = this.dateInput.value;
        
        if (dateStr.length !== 4) {
            this.daysResult.textContent = '-';
            this.targetDateDisplay.textContent = '-';
            return;
        }

        const month = parseInt(dateStr.substring(0, 2));
        const day = parseInt(dateStr.substring(2, 4));

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            this.daysResult.textContent = '-';
            this.targetDateDisplay.textContent = '-';
            return;
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        
        let targetDate = new Date(currentYear, month - 1, day);

        if (targetDate <= today) {
            targetDate = new Date(currentYear + 1, month - 1, day);
        }

        const timeDiff = targetDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        this.daysResult.textContent = daysDiff;
        this.targetDateDisplay.textContent = this.formatWesternDate(targetDate);
    }

    formatWesternDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[date.getDay()];
        
        return `${year}年${month}月${day}日 (${weekday})`;
    }

    formatJapaneseDate(date) {
        const year = date.getFullYear();
        let era = '';
        let eraYear = 0;

        if (year >= 2019) {
            era = '令和';
            eraYear = year - 2018;
        } else if (year >= 1989) {
            era = '平成';
            eraYear = year - 1988;
        } else if (year >= 1926) {
            era = '昭和';
            eraYear = year - 1925;
        } else {
            era = '大正';
            eraYear = year - 1911;
        }

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[date.getDay()];

        return `${era}${eraYear}年${month}月${day}日 (${weekday})`;
    }

    calculateDaysBetween() {
        const startDateStr = this.startDateInput.value;
        const endDateStr = this.endDateInput.value;
        
        if (startDateStr.length !== 4 || endDateStr.length !== 4) {
            this.daysBetweenResult.textContent = '-';
            this.dateRangeDisplay.textContent = '-';
            return;
        }

        const startMonth = parseInt(startDateStr.substring(0, 2));
        const startDay = parseInt(startDateStr.substring(2, 4));
        const endMonth = parseInt(endDateStr.substring(0, 2));
        const endDay = parseInt(endDateStr.substring(2, 4));

        if (startMonth < 1 || startMonth > 12 || startDay < 1 || startDay > 31 ||
            endMonth < 1 || endMonth > 12 || endDay < 1 || endDay > 31) {
            this.daysBetweenResult.textContent = '-';
            this.dateRangeDisplay.textContent = '-';
            return;
        }

        const currentYear = new Date().getFullYear();
        let startDate = new Date(currentYear, startMonth - 1, startDay);
        let endDate = new Date(currentYear, endMonth - 1, endDay);

        // 終了日が開始日より前の場合、終了日を翌年にする
        if (endDate < startDate) {
            endDate = new Date(currentYear + 1, endMonth - 1, endDay);
        }

        const timeDiff = endDate - startDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        this.daysBetweenResult.textContent = daysDiff;
        this.dateRangeDisplay.textContent = `${this.formatShortDate(startDate)} ～ ${this.formatShortDate(endDate)}`;
    }

    formatShortDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}/${month}/${day}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DateCalculator();
});