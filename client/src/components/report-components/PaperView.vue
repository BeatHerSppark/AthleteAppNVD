<template>
  <div class="container">
    <div class="report-container" id="reportContainer" ref="exportHTML">
      <div class="report-header">
        <div class="report-title">Athlete Performance Report</div>
        <div class="report-subtitle">Comprehensive Health & Performance Analysis</div>
      </div>
      <div class="patient-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Athlete Name</div>
            <div class="info-value">{{ reportDetails?.patient }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">EMBG</div>
            <div class="info-value">{{ reportDetails?.embg }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Doctor</div>
            <div class="info-value">Dr. {{ reportDetails?.doctor }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Height</div>
            <div class="info-value">{{ reportDetails?.height }} cm</div>
          </div>
          <div class="info-item">
            <div class="info-label">Weight</div>
            <div class="info-value">{{ reportDetails?.weight }} kg</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <span class="status-badge">{{ reportDetails?.status }}</span>
          </div>
        </div>
      </div>
      <div class="results-section text-center">
        <div class="section-title">Cardiovascular Performance</div>
        <table class="results-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Result</th>
              <th>Units</th>
              <th>Reference Range</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rep in report" :key="rep.label">
              <td>{{ rep.label }}</td>
              <td :class="flagColorClass(rep.level)">{{ rep.value }}</td>
              <td>{{ getUnit(rep.label) }}</td>
              <td :class="getReferenceRange(rep.label) !== '-' ? '' : 'fst-italic text-secondary'">
                {{ getReferenceRange(rep.label) !== '-' ? getReferenceRange(rep.label) : 'No info provided' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer">
        <p><strong>Sports Medicine Center</strong> | Athlete360 Online Platform</p>
        <p>Phone: (389) 75 622 486 | Confidential medical information</p>
      </div>
    </div>
  </div>
  <div class="text-center">
    <button @click="exportToPdf" class="export-pdf-button">Export As PDF</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { reportService } from '../../services/reportService'
import { METRICS_NAMES, REPORT_METRICS_RANGES, REPORT_METRICS_UNITS } from '../../constants/reportMetrics'
import type { ReportDetails, ReportFlags, FlagLevel } from '../../types'

const route = useRoute()
const exportHTML = ref<HTMLElement | null>(null)

const reportDetails = ref<ReportDetails | null>(null)
const reportFlags = ref<ReportFlags | null>(null)
const report = ref<{ label: string; value: number; level: FlagLevel | undefined }[]>([])

function fillReportObject() {
  if (!reportDetails.value) return
  const result: { label: string; value: number; level: FlagLevel | undefined }[] = []
  for (const metric of METRICS_NAMES) {
    const flagObj = (reportFlags.value as any)?.[metric]
    if (flagObj) {
      result.push({ label: metric, value: flagObj.value, level: flagObj.level })
    } else {
      const value = (reportDetails.value as any)?.[metric]
      if (value !== undefined && value !== null) {
        result.push({ label: metric, value, level: undefined })
      }
    }
  }
  report.value = result
}

function getUnit(metric: string): string {
  return REPORT_METRICS_UNITS[metric] || ''
}

function getReferenceRange(metric: string): string {
  return REPORT_METRICS_RANGES[metric] || '-'
}

function flagColorClass(level?: string) {
  switch (level) {
    case 'RED':
      return 'val-red'
    case 'YELLOW':
      return 'val-yellow'
    case 'GREEN':
      return 'val-green'
    default:
      return ''
  }
}

function exportToPdf() {
  if (!exportHTML.value) return
  html2canvas(exportHTML.value).then(canvas => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width - 20
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${reportDetails.value?.patient}-${reportDetails.value?.reportId}.pdf`)
  })
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  const [detailsRes, flagsRes] = await Promise.all([
    reportService.getReportById(id),
    reportService.getReportFlags(id)
  ])
  reportDetails.value = detailsRes.data
  reportFlags.value = flagsRes.data
  fillReportObject()
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border: 2px solid #ddd;
  font-family: Arial, Helvetica, sans-serif;
  color: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.report-header {
  text-align: center;
  padding: 15px;
  border-bottom: 3px solid #1a75bc;
}

.report-title {
  font-size: 26px;
  font-weight: bold;
  color: #1a75bc;
}

.report-subtitle {
  font-size: 15px;
  color: #555;
}

.patient-info {
  background: #f5faff;
  padding: 15px;
  border: 1px solid #d6e9f5;
  border-radius: 6px;
  margin-top: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.info-label {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
}

.info-value {
  font-size: 14px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: #222222;
  display: inline-block;
}

.section-title {
  font-weight: bold;
  margin: 25px 0 8px;
  font-size: 17px;
  border-bottom: 2px solid #1a75bc;
  padding-bottom: 4px;
  color: #1a75bc;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 20px;
}

.results-table th, .results-table td {
  border: 1px solid #ccc;
  padding: 8px 10px;
  text-align: left;
}

.results-table th {
  background-color: #f1f5f9;
  font-weight: bold;
  text-align: center;
}

.results-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.results-table tbody tr:hover {
  background-color: #f0f7ff;
}

tbody tr td + td {
  text-align: center;
}

tbody tr td:nth-child(3) {
  font-style: italic;
  color: #6c757d;
}

.footer {
  border-top: 2px solid #ccc;
  padding-top: 10px;
  font-size: 12px;
  color: #555;
  text-align: center;
  margin-top: 30px;
}

.val-yellow {
  color: #d39e00;
  font-weight: bold;
}

.val-red {
  color: #d9534f;
  font-weight: bold;
}

.val-green {
  color: #1f7a1f;
  font-weight: bold;
}

.export-pdf-button {
  background: linear-gradient(135deg, #e53935, #b71c1c);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
}
</style>
