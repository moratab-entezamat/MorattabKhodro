// مدیریت باز و بسته کردن منوی کناری
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

// ذخیره اطلاعات فرم در localStorage
function saveEntry(data) {
  const storedData = JSON.parse(localStorage.getItem('carManagementData')) || [];
  storedData.push(data);
  localStorage.setItem('carManagementData', JSON.stringify(storedData));
}

// اعتبارسنجی کیلومتر (فقط عدد)
function validateKilometer(km) {
  return /^\d+$/.test(km);
}

// اعتبارسنجی کلی فرمت تاریخ (فارسی yyyy/mm/dd یا yyyy/m/d)
function validateDate(date) {
  return /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(date);
}

// اعتبارسنجی ساعت (مثلاً 14:30)
function validateTime(time) {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(time);
}

// تنظیم و هندل فرم‌ها
function setupForm(formSelector, type, fields) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // گرفتن مقادیر از فیلدها
    const data = { type, timestamp: Date.now() };
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
  // فرم ورود خودرو
  setupForm('form#carEntryForm', 'ورود خودرو', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'driver', label: 'راننده', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر', required: true },
    { name: 'date', label: 'تاریخ ورود', required: true },
    { name: 'time', label: 'ساعت ورود', required: true },
  ]);

  // فرم خروج خودرو
  setupForm('form#carExitForm', 'خروج خودرو', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'name', label: 'نام مشتری', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر', required: true },
    { name: 'date', label: 'تاریخ خروج', required: true },
    { name: 'time', label: 'ساعت خروج', required: true },
  ]);

  // فرم تست خودرو ورود
  setupForm('form#testEntryForm', 'تست خودرو ورود', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'driver', label: 'کارشناس تست خودرو', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر خودرو هنگام ورود', required: true },
    { name: 'date', label: 'تاریخ ورود از تست', required: true },
    { name: 'time', label: 'ساعت ورود از تست', required: true },
  ]);

  // فرم تست خودرو خروج
  setupForm('form#testExitForm', 'تست خودرو خروج', [
    { name: 'plate', label: 'شماره پلاک خودرو', required: true },
    { name: 'driver', label: 'کارشناس تست خودرو', required: true },
    { name: 'companion', label: 'همراه', required: false },
    { name: 'kilometer', label: 'کیلومتر خودرو هنگام خروج', required: true },
    { name: 'date', label: 'تاریخ خروج از تست', required: true },
    { name: 'time', label: 'ساعت خروج از تست', required: true },
  ]);

  // فرم ورود پرسنل
  setupForm('form#staffEntryForm', 'ورود پرسنل', [
    { name: 'staffName', label: 'نام پرسنل', required: true },
    { name: 'staffId', label: 'شماره پرسنلی', required: true },
    { name: 'date', label: 'تاریخ ورود', required: true },
    { name: 'time', label: 'ساعت ورود', required: true },
  ]);

  // فرم خروج پرسنل
  setupForm('form#staffExitForm', 'خروج پرسنل', [
    { name: 'staffName', label: 'نام پرسنل', required: true },
    { name: 'staffId', label: 'شماره پرسنلی', required: true },
    { name: 'date', label: 'تاریخ خروج', required: true },
    { name: 'time', label: 'ساعت خروج', required: true },
  ]);

  // اگر صفحه گزارش هست، بارگذاری داده‌ها و تنظیم دکمه‌ها
  if (document.getElementById('reportTable')) {
    renderReport();

    // تنظیم استایل دکمه‌ها کنار هم و اضافه کردن دکمه خروجی اکسل
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

// تابع نمایش گزارش (در صفحه گزارش)
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

// بخش جستجو و حذف در صفحه گزارش
if (window.location.pathname.includes('report.html')) {
  const tableBody = document.querySelector('#reportTable tbody');
  const searchInput = document.getElementById('searchInput');
  let allData = JSON.parse(localStorage.getItem('carManagementData')) || [];

  function renderTable(data) {
    tableBody.innerHTML = '';
    if (data.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="11">هیچ داده‌ای برای نمایش وجود ندارد.</td>`;
      tableBody.appendChild(tr);
      return;
    }

    data.forEach((entry, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="row-select" data-index="${index}" /></td>
        <td>${entry.type || '-'}</td>
        <td>${entry.staffName || entry.name || '-'}</td>
        <td>${entry.staffId || '-'}</td>
        <td>${entry.plate || '-'}</td>
        <td>${entry.driver || '-'}</td>
        <td>${entry.companion || '-'}</td>
        <td>${entry.kilometer || '-'}</td>
        <td>${entry.date || '-'}</td>
        <td>${entry.time || '-'}</td>
        <td><button onclick="deleteRow(${index})">حذف</button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  window.deleteRow = function(index) {
    if (confirm('آیا مطمئن هستید؟')) {
      allData.splice(index, 1);
      localStorage.setItem('carManagementData', JSON.stringify(allData));
      renderTable(allData);
    }
  };

  window.deleteSelected = function() {
    const checkboxes = document.querySelectorAll('.row-select:checked');
    if (checkboxes.length === 0) return alert('هیچ ردیفی انتخاب نشده است.');
    if (!confirm('آیا از حذف موارد انتخاب‌شده مطمئن هستید؟')) return;

    const indexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);
    indexes.forEach(i => allData.splice(i, 1));
    localStorage.setItem('carManagementData', JSON.stringify(allData));
    renderTable(allData);
  };

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      const filtered = allData.filter(entry =>
        (entry.staffName || entry.name || '').toLowerCase().includes(query) ||
        (entry.plate || '').toLowerCase().includes(query)
      );
      renderTable(filtered);
    });
  }

  renderTable(allData);

  // قابلیت جدید: تولید PDF از جدول گزارش
  const btnExportPdf = document.getElementById('exportPdfBtn');
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      generatePDF();
    });
  }

  async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const reportTable = document.getElementById('reportTable');
    if (!reportTable) {
      alert('جدول گزارش یافت نشد.');
      return;
    }

    reportTable.classList.add('pdf-friendly');

    try {
      const canvas = await html2canvas(reportTable, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');

      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      doc.save('report.pdf');
    } catch (error) {
      alert('خطا در تولید فایل PDF: ' + error.message);
    } finally {
      reportTable.classList.remove('pdf-friendly');
    }
  }
}

// تابع تبدیل داده‌ها به CSV و دانلود آن
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
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'گزارش_مرتب_خودرو.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
