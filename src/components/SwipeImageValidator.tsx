import { Mask, SpinLoading } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { TouchEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import dragMove from '../assets/dragMove.png';
import dragS from '../assets/dragS.png';
import { checkDragImg, outDragImage } from '../utils/api';

interface OutDragImage {
  bigImgName: string;
  dragImgKey: string;
  locationy: string;
  smallImgHeight: string;
  smallImgName: string;
  smallImgWidth: string;
  sourceImgHeight: string;
  sourceImgName: string;
  sourceImgWidth: string;
}

const getCalculatedValue = () => ({
  isMouseDown: false,
  dragLis: 1,
  dragLeft: 0,
  placeWidth: 0,
  touchWidth: 0,
  locationX: 0,
});

interface SwipeImageValidatorProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (locationx: number, dragImgKey: string) => void;
}

const SwipeImageValidator = ({
  title,
  open = false,
  onClose,
  onSuccess,
}: SwipeImageValidatorProps) => {
  const [imageData, setImageData] = useState<OutDragImage>();

  const [dragBgStyle, setDragBgStyle] = useState<{
    backgroundImage: string;
    width: string;
    height: string;
  }>();

  const [dragMiniStyle, setDragMiniStyle] = useState<{
    backgroundImage: string;
    width: string;
    height: string;
    top: string;
    left: string;
  }>({
    backgroundImage: '',
    width: '0',
    height: '0',
    top: '0',
    left: '0',
  });

  const [loading, setLoading] = useState(false);
  const [progressR, setProgressR] = useState(false);

  const [commonStyle, setCommonStyle] = useState<{ width: string }>({
    width: '297px',
  });
  const [progressWidth, setProgressWidth] = useState<{ width: string }>({ width: '0' });
  const [touchStyle, setTouchStyle] = useState<{
    width: string;
    left: string;
    backgroundImage: string;
  }>({
    width: '0',
    left: '0',
    backgroundImage: '',
  });

  const dragImgKey = imageData?.dragImgKey;

  const calculatedRef = useRef<{
    isMouseDown: boolean;
    dragLis: number;
    dragLeft: number;
    placeWidth: number;
    touchWidth: number;
    locationX: number;
  }>(getCalculatedValue());

  const getVerifyImage = useCallback(() => {
    calculatedRef.current = getCalculatedValue();

    setLoading(true);

    outDragImage()
      .then((res: any) => {
        if (res.code === '200') {
          const data = res.data;

          setImageData(data);

          // 拖动图片的背景比例计算,宽高比
          const SizeCor = data.sourceImgWidth / data.sourceImgHeight;
          // 计算图片的宽度(根据屏幕的宽度)
          const bgWidth = document.body.clientWidth * 0.85;

          // 计算背景图片的高度
          const bgHeight = bgWidth / SizeCor;

          const newBI = new Image();
          newBI.src = data.bigImgName;

          newBI.onload = () => {
            setDragBgStyle({
              backgroundImage: `url("${newBI.src}")`,
              width: bgWidth + 'px',
              height: bgHeight + 'px',
            });
            setLoading(false);
          };

          // 计算小方块的宽高比

          const dragLis = Number(data.sourceImgWidth) / bgWidth;

          const miniH = Number(data.smallImgHeight) / dragLis;
          const miniW = Number(data.smallImgWidth) / dragLis;
          const miniTop = Number(data.locationy) / dragLis;

          calculatedRef.current.dragLis = dragLis;

          setDragMiniStyle({
            backgroundImage: `url("${data.smallImgName}")`,
            height: miniH + 'px',
            width: miniW + 'px',
            top: miniTop + 'px',
            left: '0',
          });

          // 拖动条

          setTouchStyle({
            width: miniW + 'px',
            left: '0',
            backgroundImage: 'url(' + dragMove + ')',
          });

          setCommonStyle({ width: bgWidth + 20 + 'px' });

          calculatedRef.current.placeWidth = bgWidth;
          calculatedRef.current.touchWidth = miniW;
          setError(false);
        } else {
          setError(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (open) {
      getVerifyImage();
    }
  }, [getVerifyImage, open]);

  const [error, setError] = useState(false);
  const [showDragTip, setShowDragTip] = useState(false);
  const [dragTip, setDragTip] = useState<string>();
  const [showProgress, setShowProgress] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const moveStart = useCallback(() => {
    setShowDragTip(false);
    setShowProgress(true);
    calculatedRef.current.isMouseDown = true;
    calculatedRef.current.dragLeft = ref.current?.getBoundingClientRect()?.left ?? 0;
  }, []);

  const handleMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (!calculatedRef.current.isMouseDown) {
        return;
      }

      const { dragLeft, placeWidth, touchWidth, dragLis } = calculatedRef.current;
      const lefts = e.touches?.[0]?.clientX - dragLeft - 50;

      const maxLf = placeWidth - touchWidth;

      let touchStyleLeft = touchStyle.left;

      if (lefts <= 0) {
        setDragMiniStyle({ ...dragMiniStyle, left: '0' });
        touchStyleLeft = '0';
        calculatedRef.current.locationX = 0;
      } else if (lefts > 0 && lefts < maxLf) {
        setDragMiniStyle({ ...dragMiniStyle, left: lefts + 'px' });

        touchStyleLeft = lefts + 'px';
        calculatedRef.current.locationX = Math.round(lefts * dragLis);
      } else {
        setDragMiniStyle({ ...dragMiniStyle, left: maxLf + 'px' });

        touchStyleLeft = maxLf + 'px';
        calculatedRef.current.locationX = Math.round(maxLf * dragLis);
      }

      setProgressWidth({ width: touchStyleLeft });
      setTouchStyle({ ...touchStyle, left: touchStyleLeft });
    },
    [dragMiniStyle, touchStyle],
  );

  const checkDrag = useCallback(() => {
    if (dragImgKey) {
      checkDragImg(calculatedRef.current.locationX, dragImgKey).then((res) => {
        const { placeWidth, touchWidth } = calculatedRef.current;
        if (res.code === '200') {
          const maxLf = placeWidth - touchWidth;

          setTouchStyle({
            ...touchStyle,
            left: maxLf + 'px',
            backgroundImage: `url(${dragS})`,
          });
          setProgressR(false);
          setTouchStyle({
            ...touchStyle,
            left: '0',
          });

          setProgressWidth({ width: '0' });
          setLoading(false);
          onSuccess(calculatedRef.current.locationX, dragImgKey);
        } else {
          setShowDragTip(true);
          setDragTip(res.msg);
          setProgressWidth({ width: '0' });
          getVerifyImage();
        }
      });
    }
  }, [dragImgKey, getVerifyImage, onSuccess, touchStyle]);

  const handleMoveEnd = useCallback(() => {
    if (!calculatedRef.current.isMouseDown) {
      return;
    }
    calculatedRef.current.isMouseDown = false;
    setLoading(true);
    checkDrag();
  }, [checkDrag]);

  const renew = useCallback(() => {
    calculatedRef.current = getCalculatedValue();
    setProgressWidth({ width: '0' });
    getVerifyImage();
  }, [getVerifyImage]);

  const intl = useIntl();

  return (
    <Mask visible={open} destroyOnClose>
      <div
        className="relative flex h-screen w-screen  flex-col justify-center"
        onTouchMove={handleMove}
        onTouchEnd={handleMoveEnd}
      >
        <Close>
          <CloseOutline onClick={onClose} />
        </Close>

        <div className="m-auto">
          <h1 className="mb-4 px-4 text-left text-xl text-white">{title}</h1>

          <Container className="relative" style={commonStyle}>
            {loading && (
              <div className="loading flex items-center justify-center">
                <SpinLoading color="primary" />
              </div>
            )}

            {error && (
              <div className="loading">
                <span className="tips" onClick={renew}>
                  Error
                </span>
              </div>
            )}

            <DragImage
              className="top-img relative h-[180px] w-[297px] bg-no-repeat"
              style={dragBgStyle}
            >
              <DragImageMove className="left-0 top-0" style={dragMiniStyle}></DragImageMove>
              {showDragTip && <p className="e-tips ">{dragTip}</p>}
            </DragImage>
            <div className="bottom-tips w-full">
              {showProgress && (
                <p className={progressR ? 'reds' : 'greens'} style={progressWidth}></p>
              )}

              <p
                className={progressR ? 'touch-btn' : 'success-btn'}
                style={touchStyle}
                ref={ref}
                onTouchStart={moveStart}
              ></p>
            </div>

            <div className="mt-4 w-full text-right">
              <span onClick={renew}>
                {intl.formatMessage({ defaultMessage: '换一张', id: 'Lj6xLm' })}
              </span>
            </div>
          </Container>
        </div>
      </div>
    </Mask>
  );
};

const Close = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 30px;
  color: white;
`;

const DragImage = styled.div`
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 125px;
  position: relative;

  .e-tips {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fe5400;
    width: 100%;
    height: 35px;
    color: white;
    line-height: 35px;
    text-align: center;
  }
`;

const DragImageMove = styled.div`
  position: absolute;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
`;

const Container = styled.div`
  background-color: #ffffff;
  border-radius: 0.1333rem;
  border: solid 1px #dcdcdc;
  padding: 10px;
  margin: 0 auto;
  position: relative;

  .loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(205, 205, 205, 0.76);
    width: 100%;
    height: 100%;
    text-align: center;
    .load {
      margin-top: 100px;
    }
    .tips {
      margin-top: 100px;
      color: white;
    }
  }

  .bottom-tips {
    position: relative;
    margin-top: 0.5rem;
    background-color: #eeeeee;
    height: 50px;
    line-height: 50px;
    text-align: center;
    .touch-btn {
      position: absolute;
      top: 0;
      cursor: pointer;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 50px;
    }
    .success-btn {
      position: absolute;
      top: 0;
      cursor: pointer;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 50px;
      color: white;
    }
    .reds {
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fe5400;
      height: 50px;
    }
    .greens {
      position: absolute;
      top: 0;
      left: 0;
      background-color: #30ca99;
      height: 50px;
      color: white;
    }
  }
`;

export default SwipeImageValidator;
