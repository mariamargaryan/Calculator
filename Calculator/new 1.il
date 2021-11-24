;bx-um trvac e selectory
;voroshel hamapatasxan nkaragrichy
;ete ayn voch hamakargayin e,
;apa segmenti hasnen yev limit@ bernavorel tvyalneri segmenti addr1 yev addr2 hascenereum
;;;grel proc vory anum e => ete segmenty 32 bitani hramanayin seg e ev hishoxutyunum e, 
;apa ayn darcnel kardalu tuyltvutyamb vorin dimum exel e


.data
gdtr dw ?
    dd ?
ldtr dw ?
addr1 dd ?
addr2 dd ?

.386p
.code
main proc far

mov ax,@data
mov ds,ax

sgdt fword ptr gdtr ;6byte gdtr-ic sksac
mov eax,dword ptr gdtr+2 ;gdt-i sksbi hascen stanum enq eax-um

xor edx,edx
mov dx,bx

;shr dx,3 ;indexy berum enq skizb
;shl dx,3 ;dx*=8
and dx,1111111111111000b ;<=>0fff8h

push edx ;myus depqi hamar

test bx,00000100b ;4 stugum enq TI-i arjeqy
jnz ld

add edx,eax ;edx-um nkaragrichi hascen TI=0
jmp k

ld: sldt ldtr
xor edx,edx
mov dx,ldtr
and dx,1111111111111000b

add edx,eax ;edx-um nkaragrichi hascen
mov ch,byte ptr[edx+7] ;7-rd byte
mov cl,byte ptr[edx+4]
shl ecx,16
mov cx,word ptr[edx+2]

pop edx
add edx,ecx

k: mov ch,byte ptr[edx+5] ;stanum enq accessi byte-y
test ch,00010000b ;stugum enq hamakargayin e te voch
jz s

mov ch,byte ptr[edx+7] ;7-rd byte
mov cl,byte ptr[edx+4]
shl ecx,16
mov cx,word ptr[edx+2]

mov addr1,ecx ;base

xor eax,eax

mov al,byte ptr[edx+6] ;hamar 6i parnakutyuny berum enq AL
and al,00001111b ;ofh

shl eax,16
mov ax,word ptr[edx]

mov addr2, eax

s: nop ;no operation

call proc1

ret
main endp

proc1 proc
push eax edx 
mov bl,byte ptr[edx+5]
test bl,10000000b ;hishox+ mej e
jz next
mov bh,byte ptr[edx+6]
test bh,01000000b ;32 bit e
jz next
test bl,00001000b
jz next
or bl,00000011b ;kardalu tuyltvutyun
mov byte ptr[edx+5], bl

next: pop edx eax
ret 
proc1 endp

end main