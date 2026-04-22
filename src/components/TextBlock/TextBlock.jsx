import "./TextBlock.css";

import Copy from "../Copy/Copy";
import BrandIcon from "../BrandIcon/BrandIcon";

const TextBlock = () => {
  return (
    <section className="text-block">
      <div className="container">
        <div className="text-block-col">
          <Copy>
            <h3>Dress it like you own it.</h3>
          </Copy>
          <div className="text-block-logo">
            <BrandIcon />
          </div>
        </div>
        <div className="text-block-col">
          <div className="text-block-copy">
            <Copy>
              <p className="bodyCopy sm">
                Limited-edition luxury clothing and accessories. Each drop is
                unique, designed to last a lifetime — sensuality, elegance and
                attention-grabbing details for women who choose to stand out.
              </p>
            </Copy>
          </div>
          <div className="text-block-copy">
            <Copy>
              <p className="bodyCopy sm">
                Crafted from refined fabrics and genuine Italian leather, every
                piece is shaped by timeless lines and Made-in-Italy
                craftsmanship. Pieces meant to be worn, loved, and owned.
              </p>
            </Copy>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
