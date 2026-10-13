"""One-time source-to-SVG contour tracing. Does not edit or replace the source JPG.
Optional reproduction: Python + pillow + opencv-python-headless.
"""
from pathlib import Path
import cv2
ROOT=Path(__file__).resolve().parents[1]
source=cv2.imread(str(ROOT/'assets/images/official-logo.jpg'),cv2.IMREAD_GRAYSCALE)
# The low contrast gray shadow is separate from the near-black brand artwork.
_,mask=cv2.threshold(source,110,255,cv2.THRESH_BINARY_INV)
contours,hierarchy=cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
paths=[];all_points=[];symbol=[];symbol_points=[]
for contour in contours:
    if cv2.contourArea(contour)<2: continue
    points=cv2.approxPolyDP(contour,0.32,True).reshape(-1,2)
    d='M'+' '.join(f'{x},{y}' for x,y in points)+'Z'
    paths.append(d);all_points.extend(points.tolist())
    if max(p[1] for p in points)<690:
        symbol.append(d);symbol_points.extend(points.tolist())
xs,ys=zip(*all_points);pad=16
box=(min(xs)-pad,min(ys)-pad,max(xs)-min(xs)+2*pad,max(ys)-min(ys)+2*pad)
def svg(box,ds,title,bg=''):
    x,y,w,h=box
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}"><title>{title}</title>{bg}<path fill="#000" fill-rule="evenodd" d="'+''.join(ds)+'"/></svg>\n'
(ROOT/'assets/images/logo-web.svg').write_text(svg(box,paths,'MT Software Solutions'))
xs,ys=zip(*symbol_points);size=max(max(xs)-min(xs),max(ys)-min(ys))+64;x=(max(xs)+min(xs)-size)/2;y=(max(ys)+min(ys)-size)/2
bg=f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="70" fill="#c9f27c"/>'
(ROOT/'assets/images/favicon.svg').write_text(svg((x,y,size,size),symbol,'MT Software Solutions',bg))
print('Source artwork bounds:',box,'; traced contours:',len(paths),'; symbol contours:',len(symbol))
