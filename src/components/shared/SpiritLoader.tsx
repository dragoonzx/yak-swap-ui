import classNames from 'classnames';

// const loadingGif = 'https://github.com/dragoonzx/yak-swap-ui/blob/master/src/assets/gif/loading-unscreen.gif';
const loadingGif = 'https://i.ibb.co/4MNvsVc/loading-unscreen.gif';

const SpiritLoader = ({ size = 'medium', className }: { size: 'small' | 'medium' | 'big'; className?: string }) => {
  const sizeClass = {
    small: 'h-8',
    medium: 'h-16',
    big: 'h-32',
  }[size];

  return <img src={loadingGif} className={classNames(sizeClass, className)} />;
};

export default SpiritLoader;
