import Image from "next/image";

export function AppFooter() {
  return (
    <footer className="border-t border-border pt-[50px] pb-[40px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="flex items-center gap-[10px] font-semibold text-base">
              <Image
                src="/landing/faculytics-owl-logo.png"
                alt=""
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
              />
              <span>Faculytics</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[320px] mt-4">
              An undergraduate thesis project by four computing students at the University of Cebu
              — exploring sentiment analysis and topic modeling on Filipino student feedback. Not
              a commercial product.
            </p>
          </div>
          <div>
            <h5 className="text-[13px] font-semibold mb-[14px] uppercase tracking-[0.04em] text-muted-foreground">
              Product
            </h5>
            <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
              <li><a href="#product" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Analytics</a></li>
              <li><a href="#product" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Sentiment engine</a></li>
              <li><a href="#product" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Topic modeling</a></li>
              <li><a href="#product" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[13px] font-semibold mb-[14px] uppercase tracking-[0.04em] text-muted-foreground">
              Institution
            </h5>
            <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
              <li><a href="#roles" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">For deans</a></li>
              <li><a href="#roles" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">For faculty</a></li>
              <li><a href="#roles" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">For admins</a></li>
              <li><a href="#insights" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Case studies</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[13px] font-semibold mb-[14px] uppercase tracking-[0.04em] text-muted-foreground">
              Company
            </h5>
            <ul className="flex flex-col gap-[10px] list-none p-0 m-0">
              <li><a href="#" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">About</a></li>
              <li><a href="#" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Security</a></li>
              <li><a href="#" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Privacy</a></li>
              <li><a href="#" className="text-sm text-foreground no-underline hover:text-[var(--brand-blue)]">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between pt-6 border-t border-border text-[13px] text-muted-foreground">
          <div>© 2026 Faculytics · CtrlAltElite Devs</div>
          <div>Cebu, Philippines</div>
        </div>
      </div>
    </footer>
  );
}
