let cur = 0, rain = false;

// Day of week → panel index
// Trip: Thu=4, Fri=5, Sat=6, Sun=0, Mon=1
    const DAY_MAP:  Record<number, number> = { 4: 0, 5: 1, 6: 2, 0: 3, 1: 4 };

const daysTabs = document.querySelector('.tabs-wrap')
const dayTabs = daysTabs!.querySelectorAll('.tab')
const rainFloat = document.querySelector('.rain-float')
rainFloat!.addEventListener('click', _ => {
    toggleRain()
})
Array.from(dayTabs, (tab, i) => {
    tab.addEventListener('click', () => {
        showDay(i)
    })
} )

function timeToMinutes(str: string) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + (m || 0);
}

function updateCards(panelIndex: number) {
    const panel = document.getElementById('day-' + panelIndex)!;
    const now = new Date();
    const nowDay = now.getDay();
    const tripDayIndex = DAY_MAP[nowDay];
    const isToday = tripDayIndex === panelIndex;
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const notice = document.getElementById('notice-' + panelIndex)!;

    if (isToday) {
        notice.style.display = 'none';
    } else if (tripDayIndex === undefined || panelIndex < tripDayIndex) {
        notice.style.display = 'block';
        notice.textContent = 'Day is complete ❤️';
    } else if (panelIndex > tripDayIndex) {
        notice.style.display = 'block';
        notice.textContent = 'Not yet little monkey 🐒 ';
    } else {
        notice.style.display = 'none';
    }

    const cards = panel.querySelectorAll('.card[data-time]');
    let nextSet = false;

    cards.forEach(card => {
        const cardMins = timeToMinutes((card as any).dataset.time);
        card.classList.remove('past', 'next-up');

        if (!isToday) {
            if (panelIndex < (tripDayIndex ?? 99)) {
                card.classList.add('past');
            }
            return;
        }

        if (cardMins < nowMins) {
            card.classList.add('past');
        } else if (!nextSet) {
            card.classList.add('next-up');
            nextSet = true;
        }
    });
}

function showDay(n: number) {
    document.querySelectorAll('.day-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('day-' + n)!.classList.add('active');
    document.querySelectorAll('.tab')[n].classList.add('active');
    cur = n;
    updateCards(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleRain() {
    rain = !rain;
    document.getElementById('rainToggle')!.classList.toggle('on', rain);
    document.getElementById('rainLabel')!.textContent = rain ? '🌧️ Rain mode' : '☀️ Sunny mode';
    document.querySelectorAll('.day-panel').forEach(p => p.classList.toggle('rain-mode', rain));
    updateCards(cur);
}

function init() {
    const now = new Date();
    const todayIndex = DAY_MAP[now.getDay()];

    // Mark today tab
    document.querySelectorAll('.tab').forEach((tab, i) => {
        if (i === todayIndex) tab.classList.add('today-tab');
    });

    // Auto-jump to today if within trip, else default to Thu
    const startDay = todayIndex !== undefined ? todayIndex : 0;
    showDay(startDay);
}

// Refresh every minute
setInterval(() => updateCards(cur), 60000);

init();