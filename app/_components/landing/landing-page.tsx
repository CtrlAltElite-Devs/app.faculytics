import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CircleCheck,
  Clock,
  Frown,
  GraduationCap,
  GripVertical,
  Layers,
  Meh,
  MessageSquareHeart,
  Plus,
  Settings,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smile,
  User,
  Users,
} from "lucide-react";

import styles from "./landing-page.module.css";

const FEATURES = [
  {
    icon: MessageSquareHeart,
    title: "Multilingual sentiment",
    body: "Classify feedback as positive, neutral, or negative across English, Tagalog, Cebuano, and common code-switched variants.",
  },
  {
    icon: Layers,
    title: "Topic themes",
    body: "Surface recurring themes across thousands of comments — ranked by volume and colored by sentiment breakdown.",
  },
  {
    icon: Shield,
    title: "Redacted by default",
    body: "Names, sections, and identifying details are stripped before faculty see any comment — no extra workflow required.",
  },
  {
    icon: SlidersHorizontal,
    title: "Configurable dimensions",
    body: "Map your questionnaire to Likert dimensions — clarity, engagement, fairness, and whatever else your deans track.",
  },
  {
    icon: BarChart3,
    title: "Interpretation bands",
    body: "Automatic classification from Excellent to Needs Improvement, using the cut-points your institution already adopts.",
  },
  {
    icon: Users,
    title: "Role-aware views",
    body: "Students, faculty, chairs, deans, and SuperAdmins each see the right scope — nothing more, nothing less.",
  },
];

const ROLES = [
  {
    icon: GraduationCap,
    title: "Students",
    body: "Submit honest, anonymous feedback per course in under five minutes.",
  },
  {
    icon: User,
    title: "Faculty",
    body: "Review redacted feedback and track your teaching trends across semesters.",
  },
  {
    icon: Users,
    title: "Deans & chairs",
    body: "Monitor college- and department-level performance with drilldown detail.",
  },
  {
    icon: Settings,
    title: "SuperAdmins",
    body: "Configure questionnaires, dimensions, and interpretation bands institution-wide.",
  },
];

const QUESTIONNAIRE_ITEMS = [
  {
    label: "The instructor explains concepts clearly.",
    kind: "scale" as const,
    kindLabel: "Likert 1–5",
    dimension: "Clarity",
  },
  {
    label: "The instructor creates a motivating learning environment.",
    kind: "scale" as const,
    kindLabel: "Likert 1–5",
    dimension: "Engagement",
  },
  {
    label: "Assessment methods are fair and aligned with course content.",
    kind: "scale" as const,
    kindLabel: "Likert 1–5",
    dimension: "Fairness",
  },
  {
    label: "What did the instructor do well this semester?",
    kind: "open" as const,
    kindLabel: "Open-ended",
    dimension: "Qualitative",
  },
];

const SUBMISSIONS = [
  {
    code: "CS 101",
    name: "Intro to Programming",
    meta: "A. Reyes · Sec 2 · 42/45 responses",
    score: "4.72",
    sentiment: "pos" as const,
    sentimentLabel: "Positive",
  },
  {
    code: "IT 305",
    name: "Software Engineering",
    meta: "M. Santos · Sec 1 · 38/40 responses",
    score: "4.28",
    sentiment: "pos" as const,
    sentimentLabel: "Positive",
  },
  {
    code: "MATH 2",
    name: "Calculus II",
    meta: "R. Cruz · Sec 4 · 29/44 responses",
    score: "3.56",
    sentiment: "neu" as const,
    sentimentLabel: "Neutral",
  },
  {
    code: "PHYS 1",
    name: "Physics I",
    meta: "L. Ramos · Sec 3 · 18/42 responses",
    score: "2.84",
    sentiment: "neg" as const,
    sentimentLabel: "Negative",
  },
];

const STATS = [
  { v: "2.4M+", l: "student comments analyzed" },
  { v: "94%", l: "sentiment classification accuracy" },
  { v: "12", l: "Philippine languages & dialects supported" },
  { v: "< 2 min", l: "from submission to analytics" },
];

const SENTIMENT_PILL_CLASS = {
  pos: styles.subPillPos,
  neu: styles.subPillNeu,
  neg: styles.subPillNeg,
} as const;

const SENTIMENT_ICON = {
  pos: Smile,
  neu: Meh,
  neg: Frown,
} as const;

export function LandingPage() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={`${styles.container} ${styles.navInner}`}>
          <Link href="/" className={styles.navBrand}>
            <Image
              src="/landing/faculytics-owl-logo.png"
              alt=""
              width={36}
              height={36}
              style={{ objectFit: "contain" }}
              priority
            />
            <span>Faculytics</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#product">Product</a>
            <a href="#questionnaires">Questionnaires</a>
            <a href="#insights">Insights</a>
            <a href="#roles">For your team</a>
            <a href="#support">Support</a>
          </div>
          <div className={styles.navCta}>
            <Link href="/auth" className={`${styles.btn} ${styles.btnBrand}`}>
              Sign in <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={`${styles.container} ${styles.heroInner}`}>
          <div>
            <span className={styles.eyebrow}>
              <span className={styles.dot} /> For University of Cebu
            </span>
            <h1 className={styles.heroTitle}>
              Faculty evaluation
              <br />
              insights for <span className={styles.accent}>academic teams.</span>
            </h1>
            <p className={styles.heroSub}>
              Track feedback, monitor teaching trends, and support better academic decisions — all
              in one sentiment-aware analytics platform built for higher education.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/auth" className={`${styles.btn} ${styles.btnBrand} ${styles.btnLg}`}>
                <span>Sign in</span> <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.heroNote}>
              <span className={styles.chk}>
                <ShieldCheck size={11} />
              </span>
              <span>Feedback is redacted before it reaches faculty.</span>
            </div>
          </div>
          <div className={styles.heroArt}>
            <Image
              src="/landing/laptop_faculytics.png"
              alt="Faculytics analytics dashboard on laptop"
              className={styles.laptop}
              width={760}
              height={475}
              priority
            />
            <Image
              src="/landing/phone_faculytics.png"
              alt="Faculytics sentiment distribution on mobile"
              className={styles.phone}
              width={300}
              height={610}
              priority
            />
          </div>
        </div>
      </header>

      <section id="product" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionEyebrow}>What Faculytics does</div>
          <h2 className={styles.sectionTitle}>
            Turn open-ended student feedback into decisions you can defend.
          </h2>
          <p className={styles.sectionSub}>
            Sentiment analysis and topic modeling across multiple Philippine languages, mapped to
            the evaluation dimensions your institution already uses.
          </p>

          <div className={styles.features}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className={styles.feature}>
                <div className={styles.featureIco}>
                  <Icon size={20} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className={`${styles.section} ${styles.showcase}`}>
        <div className={styles.container}>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseCopy}>
              <span className={styles.eb}>Dean view</span>
              <h2>See the signal in thousands of student comments.</h2>
              <p>
                Quantitative scores and qualitative sentiment, notably misaligned — or perfectly in
                sync. Faculytics tells you which, and why.
              </p>
              <ul className={styles.showcaseList}>
                <li>
                  <span className={styles.tick}>
                    <Check size={13} />
                  </span>
                  <div>
                    <strong>Top themes, ranked.</strong>
                    <span className={styles.d}>
                      Comment volume with sentiment color coding — at a glance.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.tick}>
                    <Check size={13} />
                  </span>
                  <div>
                    <strong>Suggested actions.</strong>
                    <span className={styles.d}>
                      Concrete next steps informed by the feedback themes above.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.tick}>
                    <Check size={13} />
                  </span>
                  <div>
                    <strong>Course and faculty drilldown.</strong>
                    <span className={styles.d}>
                      Jump from a college-wide trend to a single classroom in two clicks.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className={styles.showcaseArtLaptop}>
              <Image
                src="/landing/laptop_faculytics.png"
                alt="Dean analytics dashboard"
                width={620}
                height={388}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.showcase} ${styles.showcaseTight}`}>
        <div className={styles.container}>
          <div className={`${styles.showcaseGrid} ${styles.showcaseGridReverse}`}>
            <div className={styles.showcaseCopy}>
              <span className={styles.eb}>On any device</span>
              <h2>Mobile-first for faculty checking in between lectures.</h2>
              <p>
                Positive sentiment rate, semester-over-semester trend, and theme breakdown —
                readable on a phone in the five minutes between classes.
              </p>
              <ul className={styles.showcaseList}>
                <li>
                  <span className={styles.tick}>
                    <Check size={13} />
                  </span>
                  <div>
                    <strong>Positive rate headline.</strong>
                    <span className={styles.d}>
                      The one number faculty ask for first, front and center.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.tick}>
                    <Check size={13} />
                  </span>
                  <div>
                    <strong>Sentiment distribution.</strong>
                    <span className={styles.d}>
                      Clean bars for positive, neutral, and negative — no legend needed.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.tick}>
                    <Check size={13} />
                  </span>
                  <div>
                    <strong>Offline-friendly.</strong>
                    <span className={styles.d}>
                      Cached analytics means no awkward loading screens on campus Wi-Fi.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className={styles.showcaseArtPhone}>
              <Image
                src="/landing/phone_faculytics.png"
                alt="Faculytics mobile view"
                width={380}
                height={772}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.l} className={styles.stat}>
                <div className={styles.v}>{s.v}</div>
                <div className={styles.l}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionEyebrow}>Built for every role</div>
          <h2 className={styles.sectionTitle}>One platform. Right-sized for each seat.</h2>
          <p className={styles.sectionSub}>
            From the student submitting feedback to the SuperAdmin configuring the questionnaire —
            each role sees the data they need and nothing they don&apos;t.
          </p>

          <div className={styles.roles}>
            {ROLES.map(({ icon: Icon, title, body }) => (
              <div key={title} className={styles.roleCard}>
                <div className={styles.roleIco}>
                  <Icon size={18} />
                </div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="questionnaires" className={styles.workflow}>
        <div className={styles.container}>
          <div className={styles.workflowGrid}>
            <div className={styles.workflowCopy}>
              <span className={styles.eb}>Questionnaire management</span>
              <h2>Build the evaluation instrument your institution actually uses.</h2>
              <p>
                Drag-drop Likert items, open-ended prompts, and dimension tagging — all in one
                place. SuperAdmins publish once and the questionnaire goes live across every campus,
                semester, and section.
              </p>
              <ul className={styles.workflowSteps}>
                <li>
                  <span className={styles.stepNum}>1</span>
                  <div>
                    <strong>Define dimensions.</strong>
                    <span className={styles.d}>
                      Clarity, engagement, fairness, knowledge — or your own.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.stepNum}>2</span>
                  <div>
                    <strong>Compose items.</strong>
                    <span className={styles.d}>
                      Mix 5-point Likert with open-ended prompts; each item maps to a dimension.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.stepNum}>3</span>
                  <div>
                    <strong>Publish per semester.</strong>
                    <span className={styles.d}>
                      Version, schedule, and roll forward — no re-entry next term.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className={styles.builder}>
              <div className={styles.builderHead}>
                <div>
                  <div className={styles.builderTitle}>Faculty Evaluation — 2024–1S</div>
                  <div className={styles.builderSub}>12 items · 5 dimensions</div>
                </div>
                <span className={styles.builderTag}>
                  <CircleCheck size={11} /> Published
                </span>
              </div>
              {QUESTIONNAIRE_ITEMS.map((item) => (
                <div key={item.label} className={styles.qRow}>
                  <div className={styles.grip}>
                    <GripVertical size={14} />
                  </div>
                  <div className={styles.qBody}>
                    <div className={styles.qLabel}>{item.label}</div>
                    <div className={styles.qMeta}>
                      <span
                        className={`${styles.qChip} ${
                          item.kind === "scale" ? styles.qChipScale : styles.qChipOpen
                        }`}
                      >
                        {item.kindLabel}
                      </span>
                      <span className={`${styles.qChip} ${styles.qChipDim}`}>{item.dimension}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.builderFoot}>
                <button type="button" className={styles.miniBtn}>
                  <Plus size={12} /> Add item
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="submissions" className={styles.submissions}>
        <div className={styles.container}>
          <div className={`${styles.submissionsGrid} ${styles.submissionsGridReverse}`}>
            <div className={styles.workflowCopy}>
              <span className={styles.eb}>Submissions &amp; response tracking</span>
              <h2>Know exactly where responses are landing — in real time.</h2>
              <p>
                Monitor submission rates by course, campus, and section as they come in. Send gentle
                reminders, lock windows when needed, and close the semester with a complete picture.
              </p>
              <ul className={styles.workflowSteps}>
                <li>
                  <span className={styles.stepNum}>1</span>
                  <div>
                    <strong>Live response rates.</strong>
                    <span className={styles.d}>
                      Per course, per section, updated as students submit.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.stepNum}>2</span>
                  <div>
                    <strong>Anonymity by design.</strong>
                    <span className={styles.d}>
                      Identifying details stripped the moment a response is saved.
                    </span>
                  </div>
                </li>
                <li>
                  <span className={styles.stepNum}>3</span>
                  <div>
                    <strong>Automatic processing.</strong>
                    <span className={styles.d}>
                      Sentiment and topic analysis run in under two minutes per submission.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div className={styles.subMock}>
              <div className={styles.subHead}>
                <div>
                  <div className={styles.builderTitle}>Submissions this semester</div>
                  <div className={styles.builderSub}>2,481 of 3,180 students · 78%</div>
                </div>
                <span className={`${styles.builderTag} ${styles.builderTagYellow}`}>
                  <Clock size={11} /> Open · 4 days left
                </span>
              </div>

              <div>
                {SUBMISSIONS.map((s, idx) => {
                  const SentimentIcon = SENTIMENT_ICON[s.sentiment];
                  return (
                    <div
                      key={s.code}
                      className={`${styles.subRow} ${idx === 0 ? styles.subRowFirst : ""}`}
                    >
                      <span className={styles.subCode}>{s.code}</span>
                      <div>
                        <div className={styles.subName}>{s.name}</div>
                        <div className={styles.subMeta}>{s.meta}</div>
                      </div>
                      <span className={styles.subScore}>{s.score}</span>
                      <span className={`${styles.subPill} ${SENTIMENT_PILL_CLASS[s.sentiment]}`}>
                        <SentimentIcon size={11} /> {s.sentimentLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div>
                <div className={styles.subProgress}>
                  <div className={styles.subProgressBar} />
                </div>
                <div className={styles.subFootStat}>
                  <span>Overall response rate</span>
                  <span>
                    <strong>78%</strong> · +12% vs. last semester
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.testimonialWrap}>
        <div className={styles.container}>
          <div className={styles.testimonial}>
            <blockquote className={styles.testimonialQuote}>
              <span className={styles.open}>&ldquo;</span>
              We used to read hundreds of open comments by hand every semester. Faculytics surfaced
              the three themes that mattered in an afternoon — and told us where the signal was
              strongest.
              <span className={styles.close}>&rdquo;</span>
            </blockquote>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>MR</div>
              <div className={styles.testimonialWho}>
                <div className={styles.testimonialName}>Dr. Maria Reyes</div>
                <div className={styles.testimonialRole}>
                  Dean, College of Computing · University of Cebu
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2>See what your students have been trying to tell you.</h2>
            <p>
              Book a walkthrough with the Faculytics team. We&apos;ll load one semester of your real
              evaluation data and show you what&apos;s in it.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/auth" className={`${styles.btn} ${styles.btnBrand} ${styles.btnLg}`}>
                Request a demo <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth"
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnLg} ${styles.ctaOutline}`}
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.navBrand}>
                <Image
                  src="/landing/faculytics-owl-logo.png"
                  alt=""
                  width={36}
                  height={36}
                  style={{ objectFit: "contain" }}
                />
                <span style={{ fontWeight: 600, fontSize: 16 }}>Faculytics</span>
              </div>
              <p>
                Faculty evaluation insights for academic teams — built by CtrlAltElite for
                universities in the Philippines.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h5>Product</h5>
              <ul>
                <li>
                  <a href="#product">Analytics</a>
                </li>
                <li>
                  <a href="#product">Sentiment engine</a>
                </li>
                <li>
                  <a href="#product">Topic modeling</a>
                </li>
                <li>
                  <a href="#product">Integrations</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>Institution</h5>
              <ul>
                <li>
                  <a href="#roles">For deans</a>
                </li>
                <li>
                  <a href="#roles">For faculty</a>
                </li>
                <li>
                  <a href="#roles">For admins</a>
                </li>
                <li>
                  <a href="#insights">Case studies</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>Company</h5>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Security</a>
                </li>
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div>© 2026 Faculytics · CtrlAltElite Devs</div>
            <div>Cebu, Philippines</div>
          </div>
        </div>
      </footer>
    </>
  );
}
