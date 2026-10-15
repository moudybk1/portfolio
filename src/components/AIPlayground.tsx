import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import mondayPreview from "../../public/images/project-monday-preview.webp";

export default function AIPlayground() {
  return (
    <section
      id="ai-playground"
      className="deck-panel deck-playground"
      aria-labelledby="playground-title"
    >
      <div className="panel-scroll">
        <div className="panel-content playground-layout">
          <div className="playground-intro">
            <div className="deck-heading">
              <p className="deck-label">AI Playground</p>
              <h2 id="playground-title">Curiosity, turned into projects.</h2>
            </div>
            <p className="playground-description">
              Exploring AI through hands-on projects and experiments.
            </p>
          </div>

          <article className="playground-project" aria-labelledby="monday-title">
            <a
              href="https://mondaytrade.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="playground-project-link"
              aria-label="Visit Monday project website (opens in a new tab)"
            >
              <div className="playground-preview">
                <Image
                  src={mondayPreview}
                  alt="Monday website showing its AI trading terminal and three trading modes"
                  fill
                  sizes="(min-width: 1440px) 760px, (min-width: 768px) 56vw, 90vw"
                  placeholder="blur"
                />
              </div>
              <div className="playground-project-heading">
                <h3 id="monday-title">Monday</h3>
                <span className="playground-visit">
                  Visit project <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
            </a>
            <p className="playground-project-description">
              An AI trading terminal for Perpl, with market making, agentic
              trading, and TWAP execution.
            </p>
            <p className="playground-project-domain">mondaytrade.xyz</p>
          </article>
        </div>
      </div>
    </section>
  );
}
