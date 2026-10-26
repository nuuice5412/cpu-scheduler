# โปรแกรมจำลองการจัดตารางเวลาซีพียู (CPU Scheduling Simulator)

โปรแกรมจำลองการทำงานของอัลกอริทึมการจัดตารางเวลาซีพียู (CPU Scheduling Algorithms) แบบอินเทอร์แอคทีฟ ออกแบบด้วยสไตล์ **Claymorphism** ผิวสัมผัสนุ่มสามมิติ รองรับการคำนวณและแสดงผลกราฟิก Gantt Chart แบบเรียลไทม์ ภายใต้เงื่อนไขกระบวนการทั้งหมดมาถึงพร้อมกันที่เวลาเริ่มต้น **(Arrival Time: $AT = 0$)**

---

## 🚀 ฟีเจอร์เด่น (Key Features)

- **3 อัลกอริทึมมาตรฐานในระบบปฏิบัติการ (Operating System):**
  1. **FCFS (First-Come, First-Served):** ประมวลผลตามลำดับก่อน-หลัง ไม่มีการแทรกกลางคัน (Non-preemptive)
  2. **SJF (Shortest Job First - Non-Preemptive):** จัดลำดับประมวลผลงานที่สั้นที่สุดก่อน เพื่อลดเวลารอคอยเฉลี่ยให้ต่ำที่สุด
  3. **Round Robin (RR - Preemptive):** แบ่งช่วงเวลาทำงานตาม Time Quantum ($Q$) อย่างเท่าเทียม แสดงการสลับคิวเสมือนจริง
- **การแสดงผลไทม์ไลน์ Gantt Chart แบบไดนามิก:** ปรับสัดส่วนความกว้างของแต่ละบล็อกตามระยะเวลาจริง พร้อมมาร์กเกอร์บอกเวลา (Timestamps)
- **ตารางสรุปสถิติอย่างละเอียด (Detailed Metrics Table):**
  - Burst Time ($BT$)
  - Start Time ($ST$)
  - Completion Time ($CT$)
  - Turnaround Time ($TAT$)
  - Waiting Time ($WT$)
- **คำนวณค่าเฉลี่ยและแสดงสูตรขั้นตอนการคิด:**
  - Average Waiting Time ($AWT$)
  - Average Turnaround Time ($ATAT$)
  - Total Makespan (เวลารวมทั้งหมด)
- **ระบบปรับแต่งค่าที่ยืดหยุ่น:**
  - กำหนดจำนวนโปรเซสได้ตั้งแต่ 1 ถึง 10 โปรเซส
  - ปุ่มสุ่มค่าเวลาประมวลผล (Randomize BT) พร้อมแอนิเมชัน
  - ปุ่มกดค้างเพื่อเพิ่ม/ลดค่าต่อเนื่อง (Hold-to-repeat)
- **สลับภาษาได้ 2 ภาษา (Dual Language):** รองรับภาษาไทย (TH) และภาษาอังกฤษ (EN) ทั้งหน้าจอและคำอธิบาย
- **ระบบธีม 2 โหมด:** โหมดสว่าง (Light Mode) และโหมดมืด (Dark Mode)

---

## 📐 ทฤษฎีและสูตรการคำนวณ ($AT = 0$)

เนื่องจากแบบจำลองนี้กำหนดให้ทุกโปรเซสมาพร้อมกันที่เวลา $t = 0$ ($AT = 0$) จึงมีสูตรคำนวณดังนี้:

| ค่าทางสถิติ | ตัวย่อ | นิยาม | สูตรการคำนวณ ($AT = 0$) |
| :--- | :---: | :--- | :--- |
| **Burst Time** | $BT$ | เวลาที่โปรเซสต้องการใช้ซีพียู | กำหนดจากอินพุต (ms) |
| **Start Time** | $ST$ | เวลาแรกที่โปรเซสเริ่มเข้าสู่ซีพียู | $ST$ แรกที่ได้รับ CPU |
| **Completion Time** | $CT$ | เวลาที่โปรเซสประมวลผลเสร็จสิ้น | เวลาสิ้นสุดการทำงานทั้งหมด |
| **Turnaround Time** | $TAT$ | เวลาตั้งแต่มาถึงจนทำงานเสร็จ | $TAT = CT - AT = CT$ |
| **Waiting Time** | $WT$ | เวลารวมที่โปรเซสรอคอยในคิว | $WT = TAT - BT$ |
| **Average Waiting Time** | $AWT$ | เวลารอคอยเฉลี่ยของทุกโปรเซส | $AWT = \frac{\sum WT}{N}$ |
| **Average Turnaround Time** | $ATAT$ | เวลาการทำงานเสร็จเฉลี่ยของทุกโปรเซส | $ATAT = \frac{\sum TAT}{N}$ |

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
cpu-scheduler/
├── index.html        # โครงสร้างหน้าเว็บ, ระบบ UI, พจนานุกรมแปลภาษา (i18n)
├── styles.css        # สไตล์ Claymorphism, ระบบตัวแปรธีม (Light/Dark), Responsive Layout
├── app.js            # เอนจินคำนวณตรรกะอัลกอริทึม (FCFS, SJF, RR) และตัวเชื่อมต่อ UI
└── README.md         # เอกสารแนะนำและคู่มือการใช้งานโครงงาน
```

---

## 🛠️ สแตกเทคโนโลยี (Tech Stack)

- **HTML5:** Semantic Elements, Accessibility (ARIA Labels)
- **CSS3:** Custom Properties (Variables), Claymorphism Effects, Smooth Transitions & Keyframe Animations
- **JavaScript (Vanilla ES6+):** Pure Scheduling Functions, Dynamic DOM Rendering, Event Delegation

---

## 💻 วิธีการเปิดใช้งาน (How to Run)

ไม่ต้องติดตั้ง Environment หรือ Dependency ใดๆ เพิ่มเติม:
1. ทำการ Clone หรือ Download โฟลเดอร์โปรเจกต์
2. ดับเบิลคลิกเปิดไฟล์ `index.html` ผ่านเว็บเบราว์เซอร์ใดก็ได้ เช่น Google Chrome, Microsoft Edge, Firefox, Safari

---

## 👥 ผู้จัดทำโครงงาน (Author & Contributors)
- **Repository:** [nuuice5412/cpu-scheduler](https://github.com/nuuice5412/cpu-scheduler)
