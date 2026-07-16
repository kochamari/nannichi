class DateCalculator {
    constructor() {
        this.direction = 'after';
        this.initializeElements();
        this.bindEvents();
        this.setTodayAsBaseDate();
        this.setTodayAsDateRange();
        this.setActiveMode('mode1');
    }

    initializeElements() {
        this.mode1Btn = document.getElementById('mode1-btn');
        this.mode2Btn = document.getElementById('mode2-btn');
        this.mode1Content = document.getElementById('mode1');
        this.mode2Content = document.getElementById('mode2');
        this.daysInput = document.getElementById('days-input');
        this.baseDateInput = document.getElementById('base-date-input');
        this.todayBtn = document.getElementById('today-btn');
        this.directionButtons = document.querySelectorAll('.direction-btn');
        this.startDateInput = document.getElementById('start-date-input');
        this.endDateInput = document.getElementById('end-date-input');
        this.westernDate = document.getElementById('western-date');
        this.japaneseDate = document.getElementById('japanese-date');
        this.daysBetweenResult = document.getElementById('days-between-result');
        this.dateRangeDisplay = document.getElementById('date-range-display');
        this.calculationSummary = document.getElementById('calculation-summary');
    }

    bindEvents() {
        this.mode1Btn.addEventListener('click', () => this.switchMode('mode1'));
        this.mode2Btn.addEventListener('click', () => this.switchMode('mode2'));

        this.daysInput.addEventListener('input', () => this.calculateFutureDate());
        this.baseDateInput.addEventListener('input', () => this.calculateFutureDate());
        this.todayBtn.addEventListener('click', () => {
            this.setTodayAsBaseDate();
            this.calculateFutureDate();
        });
        this.directionButtons.forEach((button) => {
            button.addEventListener('click', () => this.setDirection(button.dataset.direction));
        });
        this.startDateInput.addEventListener('input', () => this.calculateDaysBetween());
        this.endDateInput.addEventListener('input', () => this.calculateDaysBetween());
        
    }

    switchMode(mode) {
        const tabs = [this.mode1Btn, this.mode2Btn];
        const panels = [this.mode1Content, this.mode2Content];

        tabs.forEach((tab, index) => {
            const isActive = tab.id === `${mode}-btn`;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            panels[index].classList.toggle('active', isActive);
            panels[index].hidden = !isActive;
        });
    }

    setActiveMode(mode) {
        this.switchMode(mode);
    }

    calculateFutureDate() {
        const days = Number(this.daysInput.value);
        const baseDate = this.parseDateInput(this.baseDateInput.value);
        
        if (!baseDate || !Number.isInteger(days) || days < 0 || this.daysInput.value === '') {
            this.westernDate.textContent = '-';
            this.japaneseDate.textContent = '-';
            this.calculationSummary.textContent = '日数を入力してください';
            return;
        }

        const offset = this.direction === 'after' ? days : -days;
        const resultDate = this.addDays(baseDate, offset);

        this.westernDate.textContent = this.formatWesternDate(resultDate);
        this.japaneseDate.textContent = this.formatJapaneseDate(resultDate);
        this.calculationSummary.textContent = `${this.formatCompactDate(baseDate)} の ${days}日${this.direction === 'after' ? '後' : '前'}`;
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
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[date.getDay()];
        const japaneseDate = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
            era: 'long', year: 'numeric', month: '2-digit', day: '2-digit'
        }).formatToParts(date).reduce((parts, part) => {
            parts[part.type] = part.value;
            return parts;
        }, {});
        const eraYear = japaneseDate.year === '1' ? '元' : japaneseDate.year;
        return `${japaneseDate.era}${eraYear}年${japaneseDate.month}月${japaneseDate.day}日 (${weekday})`;
    }

    calculateDaysBetween() {
        const startDate = this.parseDateInput(this.startDateInput.value);
        const endDate = this.parseDateInput(this.endDateInput.value);
        
        if (!startDate || !endDate) {
            this.daysBetweenResult.textContent = '-';
            this.dateRangeDisplay.textContent = '-';
            return;
        }

        const daysDiff = Math.abs(this.differenceInDays(startDate, endDate));

        this.daysBetweenResult.textContent = daysDiff;
        this.dateRangeDisplay.textContent = `${this.formatShortDate(startDate)} ～ ${this.formatShortDate(endDate)}`;
    }

    formatShortDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}/${month}/${day}`;
    }

    setDirection(direction) {
        this.direction = direction;
        this.directionButtons.forEach((button) => {
            const isActive = button.dataset.direction === direction;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
        this.calculateFutureDate();
    }

    setTodayAsBaseDate() {
        this.baseDateInput.value = this.formatDateInputValue(new Date());
    }

    setTodayAsDateRange() {
        const today = this.formatDateInputValue(new Date());
        this.startDateInput.value = today;
        this.endDateInput.value = today;
        this.calculateDaysBetween();
    }

    parseDateInput(value) {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return null;
        const [, year, month, day] = match.map(Number);
        if (!this.isValidMonthDay(year, month, day)) return null;
        return this.createLocalDate(year, month - 1, day);
    }

    createLocalDate(year, monthIndex, day) {
        return new Date(year, monthIndex, day, 12, 0, 0, 0);
    }

    startOfDay(date) {
        return this.createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
    }

    addDays(date, days) {
        return this.createLocalDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
    }

    differenceInDays(start, end) {
        const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
        const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
        return Math.round((endUtc - startUtc) / 86400000);
    }

    isValidMonthDay(year, month, day) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
        const date = this.createLocalDate(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }

    formatCompactDate(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    formatDateInputValue(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DateCalculator();
});
