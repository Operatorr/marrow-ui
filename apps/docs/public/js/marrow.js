/**
 * Marrow UI – Alpine.js Components
 * Register all interactive Marrow components with Alpine.
 */
document.addEventListener("alpine:init", () => {

  // ── Accordion ───────────────────────────────────────────────────────
  Alpine.data("mwAccordion", () => ({
    activeItem: null,
    toggle(id) {
      this.activeItem = this.activeItem === id ? null : id;
    },
    isOpen(id) {
      return this.activeItem === id;
    },
  }));

  // ── Multi-Accordion (multiple open) ─────────────────────────────────
  Alpine.data("mwAccordionMulti", () => ({
    openItems: [],
    toggle(id) {
      const idx = this.openItems.indexOf(id);
      if (idx === -1) this.openItems.push(id);
      else this.openItems.splice(idx, 1);
    },
    isOpen(id) {
      return this.openItems.includes(id);
    },
  }));

  // ── Tabs ────────────────────────────────────────────────────────────
  Alpine.data("mwTabs", (defaultTab) => ({
    active: defaultTab || "",
    setActive(tab) { this.active = tab; },
    isActive(tab) { return this.active === tab; },
  }));

  // ── Dialog ──────────────────────────────────────────────────────────
  Alpine.data("mwDialog", () => ({
    open: false,
    show() { this.open = true; },
    close() { this.open = false; },
  }));

  // ── Sheet ───────────────────────────────────────────────────────────
  Alpine.data("mwSheet", () => ({
    open: false,
    show() { this.open = true; },
    close() { this.open = false; },
  }));

  // ── Dropdown ────────────────────────────────────────────────────────
  Alpine.data("mwDropdown", () => ({
    open: false,
    toggle() { this.open = !this.open; },
    close() { this.open = false; },
  }));

  // ── Popover ─────────────────────────────────────────────────────────
  Alpine.data("mwPopover", () => ({
    open: false,
    toggle() { this.open = !this.open; },
    close() { this.open = false; },
  }));

  // ── Collapsible ─────────────────────────────────────────────────────
  Alpine.data("mwCollapsible", () => ({
    open: false,
    toggle() { this.open = !this.open; },
  }));

  // ── Switch ──────────────────────────────────────────────────────────
  Alpine.data("mwSwitch", (initial = false) => ({
    checked: initial,
    toggle() { this.checked = !this.checked; },
  }));

  // ── Checkbox ────────────────────────────────────────────────────────
  Alpine.data("mwCheckbox", (initial = false) => ({
    checked: initial,
    toggle() { this.checked = !this.checked; },
  }));

  // ── Radio Group ─────────────────────────────────────────────────────
  Alpine.data("mwRadioGroup", (initial = "") => ({
    selected: initial,
    select(val) { this.selected = val; },
    isSelected(val) { return this.selected === val; },
  }));

  // ── Tooltip ─────────────────────────────────────────────────────────
  Alpine.data("mwTooltip", () => ({
    show: false,
    enter() { this.show = true; },
    leave() { this.show = false; },
  }));

  // ── Hover Card ──────────────────────────────────────────────────────
  Alpine.data("mwHoverCard", () => ({
    show: false,
    timeout: null,
    enter() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.show = true; }, 200);
    },
    leave() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => { this.show = false; }, 100);
    },
  }));

  // ── Toast / Sonner ──────────────────────────────────────────────────
  Alpine.store("toasts", {
    items: [],
    add(toast) {
      const id = Date.now();
      this.items.push({ id, ...toast });
      if (toast.duration !== 0) {
        setTimeout(() => this.remove(id), toast.duration || 4000);
      }
    },
    remove(id) {
      this.items = this.items.filter(t => t.id !== id);
    },
  });

  // ── Command Palette ─────────────────────────────────────────────────
  Alpine.data("mwCommand", () => ({
    open: false,
    search: "",
    show() { this.open = true; this.search = ""; },
    close() { this.open = false; this.search = ""; },
    matchesSearch(text) {
      if (!this.search) return true;
      return text.toLowerCase().includes(this.search.toLowerCase());
    },
  }));

  // ── Slider ──────────────────────────────────────────────────────────
  Alpine.data("mwSlider", (min = 0, max = 100, initial = 50) => ({
    min, max,
    value: initial,
    get percentage() {
      return ((this.value - this.min) / (this.max - this.min)) * 100;
    },
    handleInput(e) {
      this.value = Number(e.target.value);
    },
  }));

  // ── Pagination ──────────────────────────────────────────────────────
  Alpine.data("mwPagination", (totalPages = 10, initial = 1) => ({
    current: initial,
    totalPages,
    goTo(page) {
      if (page >= 1 && page <= this.totalPages) this.current = page;
    },
    next() { this.goTo(this.current + 1); },
    prev() { this.goTo(this.current - 1); },
    get pages() {
      const p = [];
      const start = Math.max(1, this.current - 2);
      const end = Math.min(this.totalPages, this.current + 2);
      for (let i = start; i <= end; i++) p.push(i);
      return p;
    },
  }));

  // ── Toggle ──────────────────────────────────────────────────────────
  Alpine.data("mwToggle", (initial = false) => ({
    pressed: initial,
    toggle() { this.pressed = !this.pressed; },
  }));

  // ── Toggle Group ────────────────────────────────────────────────────
  Alpine.data("mwToggleGroup", (type = "single", initial = null) => ({
    type,
    value: type === "multiple" ? (initial || []) : (initial || ""),
    select(val) {
      if (this.type === "single") {
        this.value = this.value === val ? "" : val;
      } else {
        const idx = this.value.indexOf(val);
        if (idx === -1) this.value.push(val);
        else this.value.splice(idx, 1);
      }
    },
    isSelected(val) {
      if (this.type === "single") return this.value === val;
      return this.value.includes(val);
    },
  }));

  // ── Alert Dialog ────────────────────────────────────────────────────
  Alpine.data("mwAlertDialog", () => ({
    open: false,
    show() { this.open = true; },
    close() { this.open = false; },
    confirm() {
      this.$dispatch("confirm");
      this.close();
    },
    cancel() {
      this.$dispatch("cancel");
      this.close();
    },
  }));

  // ── Context Menu ────────────────────────────────────────────────────
  Alpine.data("mwContextMenu", () => ({
    open: false,
    x: 0, y: 0,
    show(e) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.open = true;
    },
    close() { this.open = false; },
  }));

  // ── Combobox ────────────────────────────────────────────────────────
  Alpine.data("mwCombobox", (items = []) => ({
    open: false,
    search: "",
    selected: null,
    items,
    get filtered() {
      if (!this.search) return this.items;
      return this.items.filter(i =>
        i.label.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    select(item) {
      this.selected = item;
      this.search = item.label;
      this.open = false;
    },
    toggle() { this.open = !this.open; },
  }));

  // ── Carousel ────────────────────────────────────────────────────────
  Alpine.data("mwCarousel", (count = 3) => ({
    current: 0,
    count,
    next() { this.current = (this.current + 1) % this.count; },
    prev() { this.current = (this.current - 1 + this.count) % this.count; },
    goTo(i) { this.current = i; },
  }));

  // ── Resizable Panels ───────────────────────────────────────────────
  Alpine.data("mwResizable", (initialSplit = 50) => ({
    split: initialSplit,
    dragging: false,
    startDrag(e) {
      this.dragging = true;
      const container = this.$el;
      const onMove = (ev) => {
        const rect = container.getBoundingClientRect();
        const x = (ev.clientX || ev.touches[0].clientX) - rect.left;
        this.split = Math.max(10, Math.min(90, (x / rect.width) * 100));
      };
      const onUp = () => {
        this.dragging = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onUp);
    },
  }));

  // ── Input OTP ───────────────────────────────────────────────────────
  Alpine.data("mwInputOTP", (length = 6) => ({
    length,
    values: Array(length).fill(""),
    get code() { return this.values.join(""); },
    handleInput(index, e) {
      const val = e.target.value.slice(-1);
      this.values[index] = val;
      if (val && index < this.length - 1) {
        this.$refs[`otp${index + 1}`]?.focus();
      }
    },
    handleKeydown(index, e) {
      if (e.key === "Backspace" && !this.values[index] && index > 0) {
        this.$refs[`otp${index - 1}`]?.focus();
      }
    },
  }));

  // ── Progress (animated) ─────────────────────────────────────────────
  Alpine.data("mwProgress", (initial = 0) => ({
    value: initial,
    set(v) { this.value = Math.max(0, Math.min(100, v)); },
  }));

  // ── Date Picker (simple) ────────────────────────────────────────────
  Alpine.data("mwDatePicker", () => ({
    open: false,
    selected: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    get monthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString("default", { month: "long" });
    },
    get daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },
    get firstDayOfWeek() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay();
    },
    get days() {
      const days = [];
      for (let i = 0; i < this.firstDayOfWeek; i++) days.push(null);
      for (let d = 1; d <= this.daysInMonth; d++) days.push(d);
      return days;
    },
    selectDate(day) {
      if (!day) return;
      this.selected = new Date(this.currentYear, this.currentMonth, day);
      this.open = false;
    },
    get formatted() {
      if (!this.selected) return "Pick a date";
      return this.selected.toLocaleDateString();
    },
    isSelected(day) {
      if (!this.selected || !day) return false;
      return this.selected.getDate() === day
        && this.selected.getMonth() === this.currentMonth
        && this.selected.getFullYear() === this.currentYear;
    },
    prevMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
      else this.currentMonth--;
    },
    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
      else this.currentMonth++;
    },
    toggle() { this.open = !this.open; },
  }));

  // ── Calendar (inline) ──────────────────────────────────────────────
  Alpine.data("mwCalendar", () => ({
    selected: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    get monthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString("default", { month: "long" });
    },
    get daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },
    get firstDayOfWeek() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay();
    },
    get days() {
      const days = [];
      for (let i = 0; i < this.firstDayOfWeek; i++) days.push(null);
      for (let d = 1; d <= this.daysInMonth; d++) days.push(d);
      return days;
    },
    selectDate(day) {
      if (!day) return;
      this.selected = new Date(this.currentYear, this.currentMonth, day);
    },
    isSelected(day) {
      if (!this.selected || !day) return false;
      return this.selected.getDate() === day
        && this.selected.getMonth() === this.currentMonth
        && this.selected.getFullYear() === this.currentYear;
    },
    isToday(day) {
      if (!day) return false;
      const t = new Date();
      return t.getDate() === day && t.getMonth() === this.currentMonth && t.getFullYear() === this.currentYear;
    },
    prevMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
      else this.currentMonth--;
    },
    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
      else this.currentMonth++;
    },
  }));

  // ── Sidebar ─────────────────────────────────────────────────────────
  Alpine.data("mwSidebar", (defaultOpen = true) => ({
    open: defaultOpen,
    toggle() { this.open = !this.open; },
  }));
});

/**
 * Copy-to-clipboard for code blocks.
 * Usage: <button onclick="copyCode(this)">Copy</button>
 */
function copyCode(btn) {
  const block = btn.closest(".mw-code-block");
  const code = block.querySelector("code")?.textContent || block.querySelector("pre")?.textContent || "";
  navigator.clipboard.writeText(code).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  });
}
