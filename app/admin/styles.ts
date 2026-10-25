/**
 * Styles shared by the admin pages (/admin/activity, /admin/checkouts): one
 * look for every page the owner uses, kept in one place so they stay alike.
 */
export const ADMIN_CSS = `
.aa{min-height:100dvh;background:#FFFCF8;color:#1E2726;font-family:var(--font-sans,system-ui,sans-serif);font-size:14px;line-height:1.5}
.aa-top{background:#052E20;color:#fff;padding:14px 16px}
.aa-top-in,.aa-main{max-width:1040px;margin:0 auto}
.aa-top-in{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.aa-top a{color:rgba(255,255,255,.7);font-size:13px;text-decoration:none}
.aa-top-links{display:flex;gap:6px 16px;flex-wrap:wrap}
.aa-main{padding:20px 16px 48px;display:flex;flex-direction:column;gap:14px}
.aa h2{font-size:20px;font-weight:700;margin:0 0 10px}
.aa h3{font-size:15px;font-weight:700;margin:0}
.aa-card{background:#fff;border:1px solid rgba(44,32,28,.09);border-radius:14px;padding:16px;box-shadow:0 2px 6px rgba(44,32,28,.04);display:flex;flex-direction:column;gap:8px;min-width:0}
.aa-callout{background:#FFFBEB;border-color:rgba(146,64,14,.2)}
.aa-row{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.aa-muted{color:#7A6E68}
.aa-small{font-size:12.5px;margin:0}
.aa-center{text-align:center}
.aa-bad-text{color:#9B1C1C}
.aa-link{color:#0B4A34;font-weight:600;text-decoration:none;font-size:13px}
.aa-visitor{text-decoration:none;color:inherit}
.aa-visitor:hover{border-color:rgba(11,74,52,.35)}
.aa-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.aa-two{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
.aa-stats{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.aa-stat{gap:2px}
.aa-stat-label{font-size:11px;color:#7A6E68;letter-spacing:.04em;text-transform:uppercase;margin:0}
.aa-stat-value{font-size:26px;font-weight:700;margin:0}
.aa-pills{display:flex;gap:8px;flex-wrap:wrap}
.aa-pills a{padding:6px 12px;border-radius:99px;border:1px solid rgba(44,32,28,.14);background:#fff;color:#4A403B;text-decoration:none;font-size:13px}
.aa-pills a.on{background:#0B4A34;border-color:#0B4A34;color:#fff}
.aa-tabs{display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid rgba(44,32,28,.12);margin:0 -16px;padding:0 16px;scrollbar-width:none}
.aa-tabs a{padding:9px 12px;color:#4A403B;text-decoration:none;font-size:14px;font-weight:600;white-space:nowrap;border-bottom:2.5px solid transparent;margin-bottom:-1px}
.aa-tabs a.on{color:#0B4A34;border-bottom-color:#0B4A34}
.aa-search{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.aa-search input[name=q]{flex:1 1 220px;padding:10px 12px;border-radius:10px;border:1.5px solid rgba(44,32,28,.16);font:inherit;background:#fff;min-width:0}
.aa-search button{padding:10px 16px;border-radius:10px;border:0;background:#0B4A34;color:#fff;font-weight:700;font:inherit;cursor:pointer}
.aa-search-box{background:#F6FAF8;border:1px solid rgba(11,74,52,.12);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:4px}
.aa-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0;font-size:12.5px}
.aa-chip{background:#F6F0E8;border-radius:99px;padding:2px 9px}
.aa-tag{background:#FEF3C7;color:#92400E;border-radius:99px;padding:1px 8px;font-size:11.5px;font-weight:600;white-space:nowrap}
.aa-exit{display:inline-flex;gap:6px;align-items:baseline;border-radius:8px;padding:3px 9px;font-size:12.5px;font-weight:600}
.aa-exit.good{background:#F0FDF4;color:#166534}.aa-exit.warn{background:#FFFBEB;color:#92400E}
.aa-exit.bad{background:#FEF2F2;color:#9B1C1C}.aa-exit.neutral{background:#F3F4F6;color:#374151}
.aa-bars{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}
.aa-bars li{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(60px,1fr) auto;gap:10px;align-items:center;font-size:13px}
.aa-bar-label{overflow-wrap:anywhere}
.aa-bar-track{display:block;height:12px}
.aa-bar{display:block;height:12px;min-width:2px;background:#0B4A34;border-radius:0 4px 4px 0}
.aa-bar-value{font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:600}
.aa-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.aa-table{width:100%;border-collapse:collapse;font-size:13px}
.aa-table th{font-size:11px;color:#7A6E68;text-transform:uppercase;letter-spacing:.04em;font-weight:600;text-align:right;padding:6px 8px;border-bottom:1px solid rgba(44,32,28,.14);white-space:nowrap}
.aa-table td{padding:8px;border-bottom:1px solid rgba(44,32,28,.06);text-align:right;font-variant-numeric:tabular-nums;vertical-align:top;white-space:nowrap}
.aa-table th:first-child,.aa-table td:first-child,.aa-table td.aa-left{text-align:left;white-space:normal}
.aa-table td:first-child{min-width:170px}
@media (max-width:480px){.aa-table td:first-child{min-width:120px}.aa-table th,.aa-table td{padding:7px 5px}.aa-table th{letter-spacing:0}}
.aa-table tr.hi td{background:#FFFBEB}
.aa-table tr.good td{background:#F6FDF8}
.aa-of{display:block;color:#A39890;font-size:11px}
.aa-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px 16px;margin:0}
.aa-facts dt{font-size:11px;color:#7A6E68;text-transform:uppercase;letter-spacing:.04em}
.aa-facts dd{margin:0;overflow-wrap:anywhere}
.aa code{background:#F3EDE7;padding:1px 5px;border-radius:4px;font-size:12px;overflow-wrap:anywhere}
.aa-list{margin:0;padding-left:18px}
.aa-list a{color:#0B4A34}
.aa-steps{margin:0;padding-left:20px;font-size:13px;display:flex;flex-direction:column;gap:6px}
.aa-timeline{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column}
.aa-timeline li{display:grid;grid-template-columns:86px 22px minmax(0,1fr);gap:6px;padding:6px 0;border-top:1px solid rgba(44,32,28,.06);align-items:baseline}
.aa-timeline li.bad{background:#FEF7F7}.aa-timeline li.warn{background:#FFFCF2}.aa-timeline li.good{background:#F6FDF8}
.aa-timeline time{font-variant-numeric:tabular-nums;color:#7A6E68;font-size:12px;white-space:nowrap}
.aa-detail{display:block;color:#7A6E68;font-size:12px;overflow-wrap:anywhere;white-space:normal}
.aa-gap{grid-column:1/-1;margin:0 0 2px;color:#A39890;font-size:11.5px}
.aa-empty{align-items:center;text-align:center;padding:40px 16px}
.aa-login{max-width:380px;margin:12vh auto 0}
.aa-login input{padding:11px 14px;border-radius:10px;border:1.5px solid rgba(44,32,28,.16);font:inherit}
.aa-login button{padding:12px;border-radius:10px;border:0;background:linear-gradient(135deg,#0B4A34,#A47945);color:#fff;font-weight:700;font:inherit;cursor:pointer}
`
