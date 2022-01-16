import styles from './styles.module.scss';

export const UtterancesComments: React.FC = () => (
  <section
    className={styles.section}
    ref={elem => {
      if (!elem) {
        return;
      }
      const scriptElem = document.createElement('script');
      scriptElem.src = 'https://utteranc.es/client.js';
      scriptElem.async = true;
      scriptElem.crossOrigin = 'anonymous';
      scriptElem.setAttribute('repo', 'joaovictor3g/blog-ignite');
      scriptElem.setAttribute('issue-term', 'pathname');
      scriptElem.setAttribute('label', 'blog-comment');
      scriptElem.setAttribute('theme', 'dark-blue');
      elem.appendChild(scriptElem);
    }}
  />
);
