import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const Page = forwardRef(
  (
    { children, title = "", meta, className = "", ...other }: { children?: any; title?: string; meta?: any; className?: string; [key: string]: any },
    ref: any
  ) => (
    <>
      <Helmet>
        <title>{`${import.meta.env.VITE_APP_NAME} | ${title}`}</title>
        {meta}
      </Helmet>

      <div ref={ref} className={className} {...other}>
        {children}
      </div>
    </>
  )
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
