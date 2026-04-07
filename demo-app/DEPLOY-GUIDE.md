# Deploy Guide — Factory Production Report Demo

## Cách nhanh nhất: Double-click `deploy-vercel.bat`

File này sẽ tự động: cài Vercel CLI → login → build → deploy.

---

## Nếu muốn làm thủ công

### Lần đầu tiên

```bash
# 1. Mở terminal tại thư mục demo-app
cd demo-app

# 2. Cài Vercel CLI
npm i -g vercel

# 3. Login (mở trình duyệt tự động)
vercel login

# 4. Deploy lần đầu (thiết lập project)
vercel
```

Vercel sẽ hỏi:
- **Set up and deploy?** → `Y`
- **Which scope?** → chọn tài khoản của bạn
- **Link to existing project?** → `N`
- **Project name?** → `factory-production-report` (hoặc tên muốn)
- **Directory?** → `./` (Enter)
- **Modify settings?** → `N`

### Các lần sau (cập nhật)

```bash
vercel --prod
```

---

## Link sau khi deploy

Dạng: `https://factory-production-report.vercel.app`

Gửi link này cho khách hàng (Y-nettech) để test trực tiếp trên trình duyệt.

## Custom domain (tùy chọn)

Vào https://vercel.com → project → Settings → Domains → thêm subdomain như `demo.danaexperts.com`
