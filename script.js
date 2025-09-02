// --- مدیریت منوی کناری ---
const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');

function toggleMenu() {
  const isOpen = sideMenu.classList.toggle('open');
  sideMenu.setAttribute('aria-hidden', !isOpen);
}

menuToggle.addEventListener('click', toggleMenu);
document.addEventListener('click', (e) => {
  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.remove('open');
    sideMenu.setAttribute('aria-hidden', 'true');
  }
});
menuToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleMenu();
  }
});

// --- ذخیره اطلاعات فرم در localStorage ---
function saveEntry(data) {
  const storedData = JSON.parse(localStorage.getItem('carManagementData')) || [];
  storedData.push(data);
  localStorage.setItem('carManagementData', JSON.stringify(storedData));
}

// --- اعتبارسنجی ---
function validateKilometer(km) {
  return /^\d+$/.test(km);
}
function validateDate(date) {
  return /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(date);
}
function validateTime(time) {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(time);
}

// --- راه‌اندازی فرم‌ها ---
function setupForm(formSelector, type, fields) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const data = { timestamp: Date.now() };

    // چک‌باکس خودرو سازمانی
    const isCorporateCheckbox = form.querySelector('input[name="isCorporate"]');
    let finalType = type;
    if (isCorporateCheckbox && isCorporateCheckbox.checked) {
      if (type.includes('ورود خودرو')) {
        finalType = type.replace('ورود خودرو', 'ورود خودرو سازمانی');
      } else if (type.includes('خروج خودرو')) {
        finalType = type.replace('خروج خودرو', 'خروج خودرو سازمانی');
      } else {
        finalType = type + ' سازمانی';
      }
    }
    data.type = finalType;

    for (const field of fields) {
      const el = form.elements[field.name];
      if (!el) continue;

      const val = el.value.trim();
      if (field.required && !val) {
        alert(`لطفاً فیلد "${field.label}" را وارد کنید.`);
        el.focus();
        return;
      }
      if (field.name === 'kilometer' && val && !validateKilometer(val)) {
        alert('فیلد کیلومتر فقط باید عدد باشد.');
        el.focus();
        return;
      }
      if (field.name === 'date' && val && !validateDate(val)) {
        alert('فرمت تاریخ صحیح نیست. فرمت صحیح: ۱۴۰۲/۰۵/۲۹');
        el.focus();
        return;
      }
      if (field.name === 'time' && val && !validateTime(val)) {
        alert('فرمت ساعت صحیح نیست. فرمت صحیح: ۱۴:۳۰');
        el.focus();
        return;
      }
      data[field.name] = val || null;
    }

    saveEntry(data);
    form.reset();
    alert('اطلاعات با موفقیت ثبت شد.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupForm('form#carEntryForm', 'ورود خودرو', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'driver', label: 'راننده', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر', required: true },
    { name: 'date', label: 'تاریخ ورود', required: true },
    { name: 'time', label: 'ساعت ورود', required: true },
  ]);

  setupForm('form#carExitForm', 'خروج خودرو', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'name', label: 'نام مشتری', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر', required: true },
    { name: 'date', label: 'تاریخ خروج', required: true },
    { name: 'time', label: 'ساعت خروج', required: true },
  ]);

  setupForm('form#testEntryForm', 'ورود خودرو پس از آزمون', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'driver', label: 'کارشناس تست خودرو', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر خودرو هنگام ورود', required: true },
    { name: 'date', label: 'تاریخ ورود از تست', required: true },
    { name: 'time', label: 'ساعت ورود از تست', required: true },
  ]);

  setupForm('form#testExitForm', 'خروج خودرو جهت آزمون', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'driver', label: 'کارشناس تست خودرو', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر خودرو هنگام خروج', required: true },
    { name: 'date', label: 'تاریخ خروج از تست', required: true },
    { name: 'time', label: 'ساعت خروج از تست', required: true },
  ]);

  setupForm('form#staffEntryForm', 'ورود پرسنل', [
    { name: 'staffName', label: 'نام پرسنل', required: true },
    { name: 'staffId', label: 'شماره پرسنلی', required: true },
    { name: 'date', label: 'تاریخ ورود', required: true },
    { name: 'time', label: 'ساعت ورود', required: true },
  ]);

  setupForm('form#staffExitForm', 'خروج پرسنل', [
    { name: 'staffName', label: 'نام پرسنل', required: true },
    { name: 'staffId', label: 'شماره پرسنلی', required: true },
    { name: 'date', label: 'تاریخ خروج', required: true },
    { name: 'time', label: 'ساعت خروج', required: true },
  ]);

  // اگر صفحه گزارش است
  if (document.getElementById('reportTable')) {
    renderReport();

    const actionsDiv = document.querySelector('.actions');
    if (actionsDiv) {
      actionsDiv.style.display = 'flex';
      actionsDiv.style.justifyContent = 'flex-start';
      actionsDiv.style.gap = '1rem';
      actionsDiv.style.flexWrap = 'wrap';

      if (!document.getElementById('downloadExcelBtn')) {
        const excelBtn = document.createElement('button');
        excelBtn.id = 'downloadExcelBtn';
        excelBtn.textContent = 'دانلود Excel';
        actionsDiv.appendChild(excelBtn);

        excelBtn.addEventListener('click', () => {
          downloadExcel();
        });
      }
    }
  }
});

// --- نمایش گزارش ---
function renderReport() {
  const tbody = document.querySelector('#reportTable tbody');
  const data = JSON.parse(localStorage.getItem('carManagementData')) || [];

  tbody.innerHTML = '';
  if (data.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="11">هیچ گزارشی ثبت نشده است.</td>`;
    tbody.appendChild(tr);
    return;
  }

  data.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" class="row-select" data-index="${index}" /></td>
      <td>${item.type || '-'}</td>
      <td>${item.staffName || item.name || '-'}</td>
      <td>${item.staffId || '-'}</td>
      <td>${item.plate || '-'}</td>
      <td>${item.driver || '-'}</td>
      <td>${item.companion || '-'}</td>
      <td>${item.kilometer || '-'}</td>
      <td>${item.date || '-'}</td>
      <td>${item.time || '-'}</td>
      <td><button onclick="deleteRow(${index})">حذف</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// --- حذف ردیف ---
window.deleteRow = function(index) {
  if (confirm('آیا مطمئن هستید؟')) {
    const data = JSON.parse(localStorage.getItem('carManagementData')) || [];
    data.splice(index, 1);
    localStorage.setItem('carManagementData', JSON.stringify(data));
    renderReport();
  }
};

// --- حذف موارد انتخاب شده ---
window.deleteSelected = function() {
  const checkboxes = document.querySelectorAll('.row-select:checked');
  if (checkboxes.length === 0) {
    alert('هیچ ردیفی انتخاب نشده است.');
    return;
  }
  if (!confirm('آیا از حذف موارد انتخاب‌شده مطمئن هستید؟')) return;

  let data = JSON.parse(localStorage.getItem('carManagementData')) || [];
  const indexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);
  indexes.forEach(i => data.splice(i, 1));
  localStorage.setItem('carManagementData', JSON.stringify(data));
  renderReport();
};

// --- جستجو در گزارش ---
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const data = JSON.parse(localStorage.getItem('carManagementData')) || [];
    const filtered = data.filter(entry =>
      (entry.staffName || entry.name || '').toLowerCase().includes(query) ||
      (entry.plate || '').toLowerCase().includes(query)
    );
    const tbody = document.querySelector('#reportTable tbody');
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="11">هیچ داده‌ای برای نمایش وجود ندارد.</td>`;
      tbody.appendChild(tr);
      return;
    }
    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="row-select" data-index="${index}" /></td>
        <td>${item.type || '-'}</td>
        <td>${item.staffName || item.name || '-'}</td>
        <td>${item.staffId || '-'}</td>
        <td>${item.plate || '-'}</td>
        <td>${item.driver || '-'}</td>
        <td>${item.companion || '-'}</td>
        <td>${item.kilometer || '-'}</td>
        <td>${item.date || '-'}</td>
        <td>${item.time || '-'}</td>
        <td><button onclick="deleteRow(${index})">حذف</button></td>
      `;
      tbody.appendChild(tr);
    });
  });
}

// --- دانلود Excel (CSV ساده) ---
function downloadExcel() {
  const data = JSON.parse(localStorage.getItem('carManagementData')) || [];
  if (data.length === 0) {
    alert('هیچ داده‌ای برای خروجی وجود ندارد.');
    return;
  }

  const headers = ['نوع', 'نام مشتری / پرسنل', 'شماره پرسنلی', 'پلاک', 'راننده', 'همراه', 'کیلومتر', 'تاریخ', 'ساعت'];

  const rows = data.map(item => [
    item.type || '',
    item.staffName || item.name || '',
    item.staffId || '',
    item.plate || '',
    item.driver || '',
    item.companion || '',
    item.kilometer || '',
    item.date || '',
    item.time || '',
  ]);

  function csvSafe(str) {
    if (typeof str !== 'string') return str;
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  let csvContent = headers.map(csvSafe).join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(csvSafe).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- تولید PDF با jsPDF و html2canvas (اگر نیاز داشتی) ---
// دقت کن که کتابخانه های jsPDF و html2canvas باید به صفحه اضافه شده باشند

function generatePDF() {
  const reportTable = document.getElementById('reportTable');
  if (!reportTable) {
    alert('جدول گزارش یافت نشد.');
    return;
  }
  reportTable.classList.add('pdf-friendly');

  html2canvas(reportTable, { scale: 2, backgroundColor: '#fff' }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    pdf.save('report.pdf');
    reportTable.classList.remove('pdf-friendly');
  }).catch(err => {
    alert('خطا در تولید PDF: ' + err.message);
    reportTable.classList.remove('pdf-friendly');
  });
}

// اگر دکمه export PDF داری
const btnExportPdf = document.getElementById('exportPdfBtn');
if (btnExportPdf) {
  btnExportPdf.addEventListener('click', generatePDF);
}
