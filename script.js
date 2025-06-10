class DateCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setActiveMode('mode1');
    }

    initializeElements() {
        this.mode1Btn = document.getElementById('mode1-btn');
        this.mode2Btn = document.getElementById('mode2-btn');
        this.mode1Content = document.getElementById('mode1');
        this.mode2Content = document.getElementById('mode2');
        this.daysInput = document.getElementById('days-input');
        this.dateInput = document.getElementById('date-input');
        this.westernDate = document.getElementById('western-date');
        this.japaneseDate = document.getElementById('japanese-date');
        this.daysResult = document.getElementById('days-result');
        this.targetDateDisplay = document.getElementById('target-date-display');
    }

    bindEvents() {
        this.mode1Btn.addEventListener('click', () => this.switchMode('mode1'));
        this.mode2Btn.addEventListener('click', () => this.switchMode('mode2'));
        
        this.daysInput.addEventListener('input', () => this.calculateFutureDate());
        this.dateInput.addEventListener('input', () => this.calculateDaysToDate());
        
        this.dateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
    }

    switchMode(mode) {
        if (mode === 'mode1') {
            this.mode1Btn.classList.add('active');
            this.mode2Btn.classList.remove('active');
            this.mode1Content.classList.add('active');
            this.mode2Content.classList.remove('active');
        } else {
            this.mode2Btn.classList.add('active');
            this.mode1Btn.classList.remove('active');
            this.mode2Content.classList.add('active');
            this.mode1Content.classList.remove('active');
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
}

document.addEventListener('DOMContentLoaded', () => {
    new DateCalculator();
});