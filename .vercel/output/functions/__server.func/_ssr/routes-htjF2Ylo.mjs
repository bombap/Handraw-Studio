import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { S as nearestAspect, _ as getLayout, a as LAYOUT_GROUPS, c as cn, f as extractClipboardImage, g as getColor, h as formatDuration, i as LAYOUTS, m as filterStyles, n as COLORS, o as STYLES, p as filterLayouts, r as GROUPS, t as ASPECT_OPTIONS, v as getStyle, w as resizeImageDataUrl, y as imageSizeFromDataUrl } from "./utils-V5r_Ws4e.mjs";
import { E as Check, S as Heart, T as ChevronDown, _ as LayoutTemplate, c as Shuffle, d as Plus, f as Play, g as Link2, h as LoaderCircle, l as Search, m as Minus, n as WandSparkles, o as Square, p as Pause, r as Undo2, s as Sparkles, t as X, u as RotateCcw, w as Clock3, x as ImagePlus } from "../_libs/lucide-react.mjs";
import { a as DialogPortal$1, i as DialogOverlay$1, n as DialogClose, o as DialogTitle$1, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as t, c as useStudio, h as createSsrRpc, i as TooltipTrigger, m as checkAiAvailable, n as Tooltip, p as userImageRef, r as TooltipContent, s as wakeQueue } from "./router-CpCNZqBL.mjs";
import { a as clearSubject, i as StoredImage, n as Input, o as setSubjectDataUrl, r as Lightbox, s as useImageAsSubject, t as Button } from "./lightbox-CHvPi9b0.mjs";
import { n as nn, r as qt, t as Qt } from "../_libs/react-resizable-panels.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-htjF2Ylo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
function PopoverContent({ className, align = "end", sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		align,
		sideOffset,
		className: cn("z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-xl bg-surface p-3 shadow-[var(--shadow-border-hover)] outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	}) });
}
var Textarea = import_react.forwardRef(function Textarea({ className, ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		ref,
		className: cn("flex min-h-16 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink", "placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stamp", "disabled:opacity-40 resize-none", className),
		...props
	});
});
var enhanceTheme = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("fba64eee0b78b2d774caf8a3ae991a968e84c563c7f81577a075046525ab56c6"));
var SPARKS = {
	FA: {
		vi: [
			"Một con mèo đeo kính đọc báo trên ghế công viên lúc tan tầm",
			"Ông cụ mặc vest đạp xe máy chở một chậu mai giữa Sài Gòn giờ cao điểm",
			"Cuộc họp Zoom mà tất cả đều là vịt mặc áo sơ mi",
			"Cô gái cầm ô giữa nắng tháng tư, nhìn đồng hồ rồi lại nhìn trời"
		],
		en: [
			"A cat in spectacles reading a newspaper on a park bench at rush hour",
			"An old man in a suit scooter-ing a pot of apricot blossoms through traffic",
			"A Zoom call in which every participant is a duck in a dress shirt",
			"A woman holding an umbrella in April sun, checking her watch, then the sky"
		]
	},
	FB: {
		vi: [
			"Đứa trẻ đội chảo làm mũ, đi tìm mặt trăng rơi sau hàng rào",
			"Cáo nhỏ pha trà cho thỏ trong bếp gỗ có cửa sổ nhìn ra tuyết",
			"Hai anh em thả thuyền giấy trên vũng nước sau mưa",
			"Bà kể chuyện dưới ánh đèn dầu, đứa cháu ôm gối nghe đến khuya"
		],
		en: [
			"A child wearing a saucepan as a hat, hunting a fallen moon behind a fence",
			"A little fox pouring tea for a rabbit in a wood kitchen with snow at the window",
			"Two siblings launching a paper boat into a puddle after rain",
			"A grandmother telling stories by an oil lamp, a grandchild hugging a pillow"
		]
	},
	FC: {
		vi: [
			"Cô gái tóc húi cua, áo khoác rộng, đứng trên sân thượng lúc magic hour",
			"Anh chàng tai nghe to, balo một quai, ngồi bậc cầu thang ăn bánh mì",
			"Nhân vật tóc hồng cầm ly cà phê, gió thổi tóc và khói sữa",
			"Người đi đêm với áo mưa trong suốt, thành phố neon sau lưng"
		],
		en: [
			"A buzz-cut girl in an oversized jacket on a rooftop at magic hour",
			"A guy with huge headphones, one-strap backpack, eating a baguette on stair steps",
			"A pink-haired figure holding coffee, wind lifting hair and milk steam",
			"A night walker in a clear raincoat, neon city stacked behind them"
		]
	},
	FD: {
		vi: [
			"Nữ sinh tan học, đứng trú mưa dưới mái hiên cửa hàng tạp hóa",
			"Quầy ramune hè, ánh nắng xuyên qua rèm noren, một ly đầy đá",
			"Mèo nằm cạnh cửa sổ tatami, nhìn mưa xuân trên mái ngói",
			"Ga tàu nhỏ lúc 6 giờ chiều, một chiếc cặp để quên trên ghế"
		],
		en: [
			"A schoolgirl sheltering from rain under a corner-shop awning after class",
			"A summer ramune stall, sun through a noren curtain, one glass packed with ice",
			"A cat on tatami by the window watching spring rain on tile roofs",
			"A tiny station at 6 p.m., a forgotten school bag on the bench"
		]
	},
	FE: {
		vi: [
			"Dạ yến dưới đèn lồng, khói trà và một chiếc bình men rạn",
			"Cầu đá cong sau mưa, người áo dài cầm dù dầu đi một mình",
			"Phòng thư pháp buổi sớm, ánh nắng trên giấy xuyến chỉ và nghiên mực",
			"Hồ mùa thu, hai chiếc thuyền giấy, núi xa mờ sương"
		],
		en: [
			"A night banquet under lanterns, tea steam, and a crackle-glaze vase",
			"An arched stone bridge after rain, one figure in áo dài with an oil-paper umbrella",
			"A calligraphy room at dawn, sun on xuan paper and an ink stone",
			"An autumn lake, two paper boats, distant mountains lost in mist"
		]
	},
	FH: {
		vi: [
			"Bàn làm việc đêm, màn hình code, ly trà sữa đổ một ít lên phím",
			"Tiệm photocopy cũ, ánh đèn huỳnh quang, một con tem dán lệch",
			"Ban công chung cư giờ 5 chiều, quần áo phơi và chậu xương rồng",
			"Cửa hàng tiện lợi 2 giờ sáng, nhân viên gật gù, mưa ngoài kính"
		],
		en: [
			"A night desk, a code editor glow, milk tea spilled on the keyboard",
			"An old copy shop under fluorescent light, one stamp stuck slightly crooked",
			"A 5 p.m. apartment balcony, laundry and a cactus in a tin",
			"A 2 a.m. convenience store, a nodding clerk, rain on the glass"
		]
	},
	FG: {
		vi: [
			"Hai người ngồi trên nóc xe bus hai tầng, thành phố loang màu hoàng hôn",
			"Cô gái vẽ mural trên tường gạch, sơn vẩy lên giày và gò má",
			"Khu chợ đêm, khói than, một đĩa mực nướng còn nghi ngút",
			"Phòng ngủ tuổi teen, poster cũ, nắng sọc qua rèm, một con robot đồ chơi"
		],
		en: [
			"Two people on the roof of a double-decker, the city melting into dusk",
			"A girl painting a brick mural, paint freckled on her shoes and cheek",
			"A night market, charcoal smoke, a plate of grilled squid still steaming",
			"A teen bedroom, old posters, striped sun through curtains, one toy robot"
		]
	},
	FF: {
		vi: [
			"Nhân vật que diêm đội nón lá, đứng giữa ruộng lúa chín",
			"Cô bé trong rừng thông, áo khoác rêu, cầm lồng đèn giấy",
			"Tàu điện đêm mưa, một người ôm guitar nhìn cửa sổ mờ hơi nước",
			"Lão nông ngồi bậc thềm gạch, rổ ớt đỏ và một con gà giấy"
		],
		en: [
			"A stick-figure farmer in a leaf hat standing in ripe rice fields",
			"A child in a moss-green coat holding a paper lantern in a pine forest",
			"A night tram in the rain, someone hugging a guitar at a fogged window",
			"An old farmer on a brick stoop, a basket of red chilies and a paper hen"
		]
	}
};
function pickSpark(lang, groups, exclude) {
	const pool = (groups.length ? groups : Object.keys(SPARKS)).flatMap((g) => SPARKS[g][lang]);
	const filtered = pool.filter((item) => item !== exclude);
	const source = filtered.length ? filtered : pool;
	return source[Math.floor(Math.random() * source.length)] ?? pool[0];
}
function ComposePanel() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const theme = useStudio((s) => s.theme);
	const setTheme = useStudio((s) => s.setTheme);
	const selected = useStudio((s) => s.selected);
	const toggleStyle = useStudio((s) => s.toggleStyle);
	const aspectRatio = useStudio((s) => s.aspectRatio);
	const setAspectRatio = useStudio((s) => s.setAspectRatio);
	const resolution = useStudio((s) => s.resolution);
	const setResolution = useStudio((s) => s.setResolution);
	const enqueueBatch = useStudio((s) => s.enqueueBatch);
	const jobs = useStudio((s) => s.jobs);
	const themeHistory = useStudio((s) => s.themeHistory);
	const pushThemeHistory = useStudio((s) => s.pushThemeHistory);
	const enhanceLevel = useStudio((s) => s.enhanceLevel);
	const setEnhanceLevel = useStudio((s) => s.setEnhanceLevel);
	const characterLock = useStudio((s) => s.characterLock);
	const setCharacterLock = useStudio((s) => s.setCharacterLock);
	const copiesPerStyle = useStudio((s) => s.copiesPerStyle);
	const setCopiesPerStyle = useStudio((s) => s.setCopiesPerStyle);
	const layoutId = useStudio((s) => s.layoutId);
	const setLayoutId = useStudio((s) => s.setLayoutId);
	const colorId = useStudio((s) => s.colorId);
	const setColorId = useStudio((s) => s.setColorId);
	const setStudioTab = useStudio((s) => s.setStudioTab);
	const groupFilter = useStudio((s) => s.groupFilter);
	const subjectNonce = useStudio((s) => s.subjectNonce);
	const [preview, setPreview] = (0, import_react.useState)(userImageRef.current);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [enhancing, setEnhancing] = (0, import_react.useState)(false);
	const [undoTheme, setUndoTheme] = (0, import_react.useState)(null);
	const [focused, setFocused] = (0, import_react.useState)(false);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const areaRef = (0, import_react.useRef)(null);
	const running = jobs.filter((j) => j.status === "queued" || j.status === "running").length;
	const currentAspect = ASPECT_OPTIONS.find((o) => o.id === aspectRatio) ?? ASPECT_OPTIONS[0];
	const mod = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
	(0, import_react.useEffect)(() => {
		setPreview(userImageRef.current);
	}, [subjectNonce]);
	(0, import_react.useEffect)(() => {
		const el = areaRef.current;
		if (!el) return;
		el.style.height = "auto";
		const cap = window.matchMedia("(min-width: 1024px)").matches ? 96 : 168;
		el.style.height = `${Math.min(el.scrollHeight, cap)}px`;
	}, [theme]);
	async function onFile(file, source = "pick") {
		if (!file.type.startsWith("image/")) {
			toast.error(lang === "vi" ? "Chỉ nhận file ảnh" : "Images only");
			return;
		}
		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const resized = await resizeImageDataUrl(String(reader.result));
				setSubjectDataUrl(resized);
				setPreview(resized);
				if (source === "paste") toast.success(copy.pastedImage);
				try {
					const { w, h } = await imageSizeFromDataUrl(resized);
					const next = nearestAspect(w, h);
					if ((w / h < .85 || w / h > 1.18) && aspectRatio === "1:1" && next !== "1:1") {
						setAspectRatio(next);
						toast.message(copy.aspectFromImage(next));
					}
				} catch {}
			} catch {
				toast.error(lang === "vi" ? "Không đọc được ảnh" : "Could not read image");
			}
		};
		reader.readAsDataURL(file);
	}
	async function generate() {
		if (!theme.trim()) {
			toast.error(copy.needTheme);
			return;
		}
		if (selected.length === 0) {
			toast.error(copy.needStyle);
			return;
		}
		if (selected.length > 12) {
			toast.error(copy.maxBatch(12));
			return;
		}
		setBusy(true);
		try {
			if (!(await checkAiAvailable()).available) {
				toast.error(copy.aiUnavailable);
				return;
			}
			pushThemeHistory(theme);
			const result = enqueueBatch(userImageRef.current ?? void 0);
			if (!result.ok) {
				const key = result.error;
				toast.error(key === "needTheme" || key === "needStyle" || key === "inFlight" ? copy[key] : result.error);
				return;
			}
			toast.success(lang === "vi" ? `Đã xếp ${result.count} việc vào hàng đợi` : `Queued ${result.count} jobs`);
		} finally {
			setBusy(false);
		}
	}
	async function enhance(level = enhanceLevel) {
		if (!theme.trim() && !preview) {
			toast.error(copy.enhanceNeed);
			areaRef.current?.focus();
			return;
		}
		setEnhancing(true);
		try {
			const vision = preview ? await resizeImageDataUrl(preview, 768, .8) : void 0;
			const result = await enhanceTheme({ data: {
				theme,
				lang,
				level,
				userImageDataUrl: vision
			} });
			if (!result.ok) {
				toast.error(result.error === "needTheme" ? copy.enhanceNeed : copy.enhanceFail);
				return;
			}
			if (result.theme === theme.trim()) {
				toast.message(lang === "vi" ? "Chủ đề đã đủ rõ." : "Theme is already clear.");
				return;
			}
			pushThemeHistory(theme);
			setUndoTheme(theme);
			setTheme(result.theme);
			toast.success(copy.enhanceDone);
		} catch {
			toast.error(copy.enhanceFail);
		} finally {
			setEnhancing(false);
		}
	}
	function undo() {
		if (undoTheme == null) return;
		setTheme(undoTheme);
		setUndoTheme(null);
	}
	function surprise() {
		const groups = [...new Set(selected.map((n) => getStyle(n)?.groupId).filter((g) => Boolean(g)))];
		const fromFilter = groupFilter !== "all" ? [groupFilter] : [];
		const spark = pickSpark(lang, groups.length ? groups : fromFilter, theme);
		if (theme.trim()) {
			pushThemeHistory(theme);
			setUndoTheme(theme);
		}
		setTheme(spark);
	}
	const n = Math.min(selected.length, 12) * copiesPerStyle;
	const generateLabel = busy || running > 0 ? copy.generating : n > 0 ? copy.generateN(n) : copy.generate;
	const levels = [
		{
			id: "short",
			label: copy.enhanceShort,
			hint: copy.enhanceShortHint
		},
		{
			id: "full",
			label: copy.enhanceFull,
			hint: copy.enhanceFullHint
		},
		{
			id: "cinematic",
			label: copy.enhanceCinematic,
			hint: copy.enhanceCinematicHint
		}
	];
	const enhanceBtn = (surface) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("inline-flex overflow-hidden", surface === "ink" ? "rounded-full" : "rounded-md shadow-[var(--shadow-border)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: enhancing,
				onClick: () => void enhance(),
				className: cn("inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-40", surface === "ink" ? "h-9 bg-ink px-3 text-bg" : "h-11 bg-surface px-2.5 text-ink"),
				"aria-label": copy.enhance,
				children: [enhancing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), surface === "ink" ? enhancing ? copy.enhancing : copy.enhance : null]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.enhanceHint })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("inline-flex items-center justify-center border-l border-white/20", surface === "ink" ? "h-9 w-7 bg-ink text-bg" : "h-11 w-8 bg-surface text-ink-muted"),
				"aria-label": copy.enhanceFull,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			className: "w-56",
			align: "end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-ink-muted",
				children: copy.enhance
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-1",
				children: levels.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setEnhanceLevel(item.id);
						enhance(item.id);
					},
					className: cn("rounded-md px-2 py-2 text-left", enhanceLevel === item.id ? "bg-ink text-bg" : "hover:bg-stamp-soft"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block text-xs", enhanceLevel === item.id ? "text-bg/70" : "text-ink-subtle"),
						children: item.hint
					})]
				}, item.id))
			})]
		})] })]
	});
	const surpriseBtn = (size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: surprise,
			className: cn("inline-flex items-center justify-center bg-surface text-ink-muted shadow-[var(--shadow-border)] hover:text-ink", size === "sm" ? "size-12 rounded-lg" : "size-11 rounded-md"),
			"aria-label": copy.surprise,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-3.5" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.surpriseHint })] });
	const lockBtn = (size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setCharacterLock(!characterLock),
			className: cn("inline-flex items-center justify-center gap-1.5 shadow-[var(--shadow-border)]", size === "sm" ? "h-12 rounded-lg px-3" : "size-11 rounded-md", characterLock ? "bg-ink text-bg" : "bg-surface text-ink-muted hover:text-ink"),
			"aria-pressed": characterLock,
			"aria-label": copy.characterLock,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), size === "sm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium",
				children: copy.characterLock
			}) : null]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.characterLockHint })] });
	const historyBtn = (size) => themeHistory.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("inline-flex items-center justify-center bg-surface text-ink-muted shadow-[var(--shadow-border)] hover:text-ink", size === "sm" ? "size-9 rounded-full" : "size-11 rounded-md"),
			"aria-label": copy.history,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-3.5" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		className: "w-80",
		align: "end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs font-medium text-ink-muted",
			children: copy.history
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex max-h-64 flex-col gap-1 overflow-auto",
			children: themeHistory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setUndoTheme(theme);
					setTheme(item);
				},
				className: "line-clamp-3 w-full rounded-md px-2 py-2 text-left text-sm leading-snug text-ink hover:bg-stamp-soft",
				children: item
			}) }, item))
		})]
	})] }) : null;
	const undoBtn = (size) => undoTheme != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: undo,
			className: cn("inline-flex items-center justify-center bg-surface text-ink-muted shadow-[var(--shadow-border)] hover:text-ink", size === "sm" ? "size-9 rounded-full" : "size-11 rounded-md"),
			"aria-label": copy.undoEnhance,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-3.5" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.undoEnhance })] }) : null;
	const attachControl = preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative size-12 shrink-0 overflow-hidden rounded-lg shadow-[var(--shadow-border)] lg:size-11 lg:rounded-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: preview,
			alt: "",
			className: "img-outline size-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => {
				clearSubject();
				setPreview(null);
			},
			className: "absolute inset-0 flex items-center justify-center bg-ink/50 text-bg",
			"aria-label": copy.removeImage,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => fileRef.current?.click(),
			className: "flex size-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface text-ink-muted hover:border-stamp hover:text-ink lg:size-11 lg:rounded-md",
			"aria-label": copy.attach,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5 lg:size-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.attachHint })] });
	const ratioControl = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-surface px-3 text-sm font-medium text-ink shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md lg:px-2.5 lg:text-xs",
			"aria-label": copy.aspect,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatioGlyph, {
					w: currentAspect.w,
					h: currentAspect.h
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: currentAspect.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 text-ink-subtle" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		className: "w-72 p-2",
		align: "end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1.5 px-2 text-xs font-medium text-ink-muted",
			children: copy.aspect
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex max-h-80 flex-col gap-0.5 overflow-y-auto",
			children: ASPECT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setAspectRatio(opt.id),
				className: cn("flex h-11 items-center gap-3 rounded-md px-2 text-left", aspectRatio === opt.id ? "bg-ink text-bg" : "text-ink hover:bg-stamp-soft"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatioGlyph, {
						w: opt.w,
						h: opt.h
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm tabular-nums",
						children: opt.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-xs", aspectRatio === opt.id ? "text-bg/70" : "text-ink-muted"),
						children: lang === "vi" ? opt.nameVi : opt.nameEn
					}),
					aspectRatio === opt.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "ml-auto size-3.5" }) : null
				]
			}, opt.id))
		})]
	})] });
	const resolutionControl = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-12 flex-1 items-center rounded-lg bg-surface p-1 shadow-[var(--shadow-border)] lg:h-11 lg:flex-none lg:rounded-md",
		children: ["1k", "2k"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setResolution(r),
			className: cn("h-10 flex-1 rounded-md px-2 text-sm font-medium uppercase lg:h-9 lg:min-w-10 lg:flex-none lg:text-xs", resolution === r ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"),
			children: r
		}, r))
	});
	const copiesControl = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-12 shrink-0 items-center rounded-lg bg-surface p-1 shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md",
			"aria-label": copy.copies,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: copiesPerStyle <= 1,
					onClick: () => setCopiesPerStyle(copiesPerStyle - 1),
					className: "flex size-10 items-center justify-center rounded-md text-ink-muted hover:text-ink disabled:opacity-30 lg:size-9",
					"aria-label": "−",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-8 text-center text-sm font-medium tabular-nums lg:text-xs",
					children: ["×", copiesPerStyle]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: copiesPerStyle >= 5,
					onClick: () => setCopiesPerStyle(copiesPerStyle + 1),
					className: "flex size-10 items-center justify-center rounded-md text-ink-muted hover:text-ink disabled:opacity-30 lg:size-9",
					"aria-label": "+",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: copy.copiesHint })] });
	const color = getColor(colorId);
	const colorControl = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-12 shrink-0 items-center gap-1.5 rounded-lg bg-surface px-2.5 shadow-[var(--shadow-border)] lg:h-11 lg:rounded-md",
			"aria-label": copy.color,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-4 rounded-full shadow-[var(--shadow-border)]",
					style: { background: color?.hex ?? "conic-gradient(#002FA7,#9CAF88,#DE2910,#C9A0A0,#CC7722,#002FA7)" }
				}),
				color ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tabular-nums",
					children: color.id
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5 text-ink-subtle" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		className: "w-80 p-2",
		align: "end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-ink-muted",
					children: copy.color
				}), color ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-stamp",
					onClick: () => setColorId(null),
					children: copy.colorClear
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-6 gap-1.5",
				children: COLORS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					title: lang === "vi" ? item.nameVi : item.nameEn,
					onClick: () => setColorId(colorId === item.id ? null : item.id),
					className: cn("flex flex-col items-center gap-1 rounded-md p-1", colorId === item.id ? "bg-ink text-bg" : "hover:bg-stamp-soft"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-8 rounded-full shadow-[var(--shadow-border)]",
						style: { background: item.hex }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] tabular-nums",
						children: item.id.slice(2)
					})]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 px-1 text-[11px] leading-snug text-ink-muted",
				children: [color ? `${color.id} · ${lang === "vi" ? color.nameVi : color.nameEn}. ` : "", copy.colorHint]
			})
		]
	})] });
	const layout = getLayout(layoutId);
	const chips = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "chip-scroll flex gap-1.5 overflow-x-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setStudioTab("layouts"),
			className: cn("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full pr-2 pl-0.5 shadow-[var(--shadow-border)]", layout ? "bg-ink text-bg" : "bg-surface text-ink-muted"),
			children: [
				layout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: layout.previewUrl,
					alt: "",
					className: "size-7 rounded-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-7 items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutTemplate, { className: "size-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs",
					children: layout ? layout.id : copy.layoutNone
				}),
				layout ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "size-3 opacity-70",
					onClick: (e) => {
						e.stopPropagation();
						setLayoutId(null);
					}
				}) : null
			]
		}), selected.map((num) => {
			const style = getStyle(num);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => toggleStyle(num),
				className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-surface pr-2 pl-0.5 shadow-[var(--shadow-border)]",
				children: [
					style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: style.previewUrl,
						alt: "",
						className: "size-7 rounded-full object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-stamp tabular-nums",
						children: [
							"#",
							num,
							copiesPerStyle > 1 ? ` ×${copiesPerStyle}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3 text-ink-subtle" })
				]
			}, num);
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "shrink-0 border-t border-line bg-bg-elevated/95 backdrop-blur-md lg:border-t-0 lg:border-b",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2.5 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-5 lg:py-2.5",
			children: [
				chips,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "theme-input",
					className: "sr-only",
					children: copy.themeLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5 lg:flex-row lg:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("relative lg:min-w-0 lg:flex-1", dragging && "rounded-lg ring-2 ring-stamp ring-offset-2 ring-offset-bg"),
							onDragOver: (e) => {
								e.preventDefault();
								setDragging(true);
							},
							onDragLeave: () => setDragging(false),
							onDrop: (e) => {
								e.preventDefault();
								setDragging(false);
								const file = e.dataTransfer.files[0];
								if (file) onFile(file, "drop");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "theme-input",
									ref: areaRef,
									value: theme,
									onChange: (e) => {
										setTheme(e.target.value);
										if (undoTheme != null) setUndoTheme(null);
									},
									onFocus: () => setFocused(true),
									onBlur: () => setFocused(false),
									onPaste: (e) => {
										const file = extractClipboardImage(e);
										if (!file) return;
										e.preventDefault();
										const text = e.clipboardData.getData("text/plain").trim();
										onFile(file, "paste");
										if (text && !theme.trim()) setTheme(text);
									},
									onKeyDown: (e) => {
										if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
											e.preventDefault();
											generate();
										}
										if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "e") {
											e.preventDefault();
											enhance();
										}
									},
									placeholder: copy.themePlaceholder,
									title: `${copy.pasteHint.replace("Ctrl", mod)} · ${copy.generateKbd.replace("Ctrl", mod)}`,
									rows: 3,
									className: "min-h-28 w-full px-3.5 pt-3 pb-11 text-base leading-relaxed lg:h-11 lg:min-h-11 lg:max-h-24 lg:py-2.5 lg:pr-3 lg:pb-2.5 lg:text-sm",
									"aria-label": copy.themeLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-2 bottom-2 flex items-center gap-1 lg:hidden",
									children: [undoBtn("sm"), enhanceBtn("ink")]
								}),
								focused && !preview && !theme.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "pointer-events-none absolute bottom-3 left-3 max-w-[40%] truncate text-[0.65rem] text-ink-subtle lg:hidden",
									children: copy.pasteHint.replace("Ctrl", mod)
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline-flex",
									children: surpriseBtn("md")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline-flex",
									children: historyBtn("md")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline-flex",
									children: undoBtn("md")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline-flex",
									children: enhanceBtn("paper")
								}),
								attachControl,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (file) onFile(file);
										e.target.value = "";
									}
								}),
								ratioControl,
								colorControl,
								resolutionControl,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline-flex",
									children: copiesControl
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline-flex",
									children: lockBtn("md")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "hidden h-11 shrink-0 px-4 lg:inline-flex",
									disabled: busy || n === 0,
									onClick: () => void generate(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), generateLabel]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 lg:hidden",
							children: [
								lockBtn("sm"),
								surpriseBtn("sm"),
								copiesControl,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "h-12 min-w-0 flex-1 text-base",
									disabled: busy || n === 0,
									onClick: () => void generate(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), generateLabel]
								})
							]
						})
					]
				})
			]
		})
	});
}
function RatioGlyph({ w, h }) {
	const max = Math.max(w, h);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-block rounded-[1px] border border-current opacity-80",
		style: {
			width: `${6 + w / max * 10}px`,
			height: `${6 + h / max * 10}px`
		}
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-stamp-soft text-stamp",
		muted: "bg-line text-ink-muted",
		outline: "border border-line text-ink-muted",
		ok: "bg-ok/12 text-ok",
		warn: "bg-warn/12 text-warn",
		danger: "bg-danger/12 text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Progress({ value, className }) {
	const pct = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-line", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-stamp transition-[width] duration-300 ease-out",
			style: { width: `${pct}%` }
		})
	});
}
var STATUS_VARIANT = {
	queued: "muted",
	running: "warn",
	done: "ok",
	error: "danger",
	cancelled: "outline"
};
function JobDock() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const jobs = useStudio((s) => s.jobs);
	const paused = useStudio((s) => s.paused);
	const setPaused = useStudio((s) => s.setPaused);
	const cancelJob = useStudio((s) => s.cancelJob);
	const cancelQueued = useStudio((s) => s.cancelQueued);
	const retryJob = useStudio((s) => s.retryJob);
	const retryFailed = useStudio((s) => s.retryFailed);
	const setActiveJob = useStudio((s) => s.setActiveJob);
	const setLightbox = useStudio((s) => s.setLightbox);
	const durations = useStudio((s) => s.durations);
	const concurrency = useStudio((s) => s.concurrency);
	const setConcurrency = useStudio((s) => s.setConcurrency);
	const avg = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 28e3;
	const [open, setOpen] = (0, import_react.useState)(true);
	const live = jobs.filter((j) => j.status === "queued" || j.status === "running");
	const done = jobs.filter((j) => j.status === "done").length;
	const failed = jobs.filter((j) => j.status === "error");
	const recent = jobs.slice(0, 24);
	const total = jobs.length;
	const progress = total ? done / total * 100 : 0;
	const etaMs = jobs.filter((j) => j.status === "queued").length * (avg / Math.max(1, concurrency));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "shrink-0 border-t border-line bg-bg-elevated/80 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 px-3 py-2 sm:px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen((v) => !v),
					className: "flex min-w-0 flex-1 items-center gap-2 text-left",
					"aria-expanded": open,
					"aria-label": open ? copy.collapseQueue : copy.expandQueue,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 shrink-0 text-ink-subtle transition-transform duration-150", !open && "-rotate-90") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base font-medium tracking-tight",
							children: copy.queue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-ink-subtle tabular-nums",
							children: [
								live.length,
								" ",
								copy.running.toLowerCase(),
								" · ",
								copy.eta,
								" ",
								formatDuration(etaMs),
								" ·",
								" ",
								concurrency,
								" ",
								copy.workers
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-0.5 rounded-md bg-surface p-0.5 shadow-[var(--shadow-border)] sm:flex",
					children: [
						1,
						2,
						3,
						4
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConcurrency(n),
						className: cn("size-8 rounded-sm text-xs tabular-nums", concurrency === n ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"),
						"aria-label": `${copy.concurrency} ${n}`,
						children: n
					}, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => {
								if (paused) wakeQueue();
								else setPaused(true);
							},
							children: [paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: paused ? copy.resume : copy.pause
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: cancelQueued,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: copy.cancelAll
							})]
						}),
						failed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: retryFailed,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: copy.retryFailed
							})]
						}) : null
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-2 sm:px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "film-scroll flex gap-2 overflow-x-auto px-3 pb-3 sm:px-5",
			children: recent.map((job) => {
				const style = getStyle(job.styleNumber);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "w-28 shrink-0 overflow-hidden rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "relative block aspect-square w-full overflow-hidden rounded-md bg-bg-elevated",
						onClick: () => {
							setActiveJob(job.id);
							if (job.imageId) setLightbox(job.imageId);
						},
						children: [job.imageId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredImage, {
							id: job.imageId,
							alt: `#${job.styleNumber}`,
							className: "size-full"
						}) : style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: style.previewUrl,
							alt: "",
							className: "size-full object-cover opacity-70"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-line" }), job.status === "running" || job.status === "queued" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 flex items-center justify-center bg-ink/25",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-surface" })
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-1 px-1 pt-1.5 pb-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate font-mono text-xs tabular-nums",
									children: [
										"#",
										job.styleNumber,
										job.copies > 1 ? ` · ${job.copyIndex}/${job.copies}` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: STATUS_VARIANT[job.status],
									className: "mt-0.5",
									children: copy[job.status]
								})]
							}),
							job.status === "queued" || job.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-line hover:text-ink",
								onClick: () => cancelJob(job.id),
								"aria-label": copy.cancel,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3" })
							}) : null,
							job.status === "error" || job.status === "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-7 items-center justify-center rounded-sm text-ink-subtle hover:bg-line hover:text-ink",
								onClick: () => retryJob(job.id),
								"aria-label": copy.retry,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" })
							}) : null
						]
					})]
				}, job.id);
			})
		})] }) : null]
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2 touch-none select-none p-0.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-line-strong" })
		})]
	});
}
function LayoutGrid$1({ compact = false }) {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const layoutId = useStudio((s) => s.layoutId);
	const setLayoutId = useStudio((s) => s.setLayoutId);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const layouts = (0, import_react.useMemo)(() => filterLayouts({
		query,
		category
	}), [query, category]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex flex-col border-b border-line px-3 sm:px-5", compact ? "gap-2 py-2" : "gap-3 py-3 sm:py-4"),
			children: [
				compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl leading-tight font-medium tracking-tight",
						children: copy.layouts
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-ink-subtle tabular-nums",
						children: [
							layouts.length,
							copy.of,
							LAYOUTS.length,
							layoutId ? ` · ${copy.layoutOn}` : ` · ${copy.layoutOff}`
						]
					})] }), layoutId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink",
						onClick: () => setLayoutId(null),
						children: copy.layoutClear
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: copy.searchLayouts,
						className: cn("pl-9 text-base lg:text-sm", compact && "h-10")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "chip-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5",
					children: LAYOUT_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCategory(g.id),
						className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap", category === g.id ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink"),
						children: lang === "vi" ? g.labelVi : g.labelEn
					}, g.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
			className: "min-h-0 flex-1",
			children: layouts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-8 text-sm text-ink-muted",
				children: copy.noLayouts
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-3",
				children: layouts.map((layout) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutCard, {
					layout,
					selected: layoutId === layout.id,
					name: lang === "vi" ? layout.nameVi : layout.nameEn,
					onToggle: () => setLayoutId(layoutId === layout.id ? null : layout.id)
				}, layout.id))
			})
		})]
	});
}
function LayoutCard({ layout, selected, name, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onToggle,
		className: cn("group relative rounded-xl bg-surface p-1 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out", "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]", selected && "ring-2 ring-stamp ring-offset-2 ring-offset-bg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[3/4] overflow-hidden rounded-lg bg-bg-elevated",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: layout.previewUrl,
					alt: `${layout.id} ${name}`,
					loading: "lazy",
					decoding: "async",
					className: "img-outline size-full object-cover object-top"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("absolute top-1.5 left-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[10px] tabular-nums", selected ? "bg-stamp text-stamp-fg" : "bg-ink/80 text-bg-elevated"),
					children: layout.id
				}),
				selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-stamp text-stamp-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 line-clamp-2 px-1 pb-1 text-xs leading-snug text-ink",
			children: name
		})]
	});
}
function LiveCanvas() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const jobs = useStudio((s) => s.jobs);
	const setLightbox = useStudio((s) => s.setLightbox);
	const latestBatch = (0, import_react.useMemo)(() => {
		if (jobs.length === 0) return void 0;
		return jobs.reduce((best, job) => job.createdAt >= best.createdAt ? job : best).batchId;
	}, [jobs]);
	const batchJobs = (0, import_react.useMemo)(() => latestBatch ? jobs.filter((j) => j.batchId === latestBatch) : [], [jobs, latestBatch]);
	const show = batchJobs.length > 0 ? batchJobs : jobs.filter((j) => j.status === "done").slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden paper-grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-baseline justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl leading-tight font-medium tracking-tight",
					children: copy.thisBatch
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-ink-subtle tabular-nums",
					children: show.length
				})]
			}),
			show.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl",
					children: copy.emptyCanvas
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm leading-relaxed text-ink-muted",
					children: copy.emptyCanvasHint
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 p-4 sm:p-5 xl:grid-cols-3",
					children: show.map((job) => {
						const style = getStyle(job.styleNumber);
						const ratio = job.aspectRatio.split(":").map(Number);
						const pad = ratio[1] && ratio[0] ? ratio[1] / ratio[0] * 100 : 100;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rise-in overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "relative block w-full overflow-hidden rounded-lg",
								style: { paddingBottom: `${pad}%` },
								onClick: () => job.imageId && setLightbox(job.imageId),
								disabled: !job.imageId,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0",
									children: job.imageId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredImage, {
										id: job.imageId,
										alt: `#${job.styleNumber} ${job.theme}`,
										className: "size-full"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("flex size-full items-center justify-center bg-bg-elevated", job.status === "error" && "bg-stamp-soft"),
										children: job.status === "running" || job.status === "queued" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-ink-subtle" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-3 text-center text-xs text-ink-muted",
											children: job.error ?? copy[job.status]
										})
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 px-2.5 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate font-mono text-xs tabular-nums",
										children: [
											"#",
											job.styleNumber,
											job.layoutId ? ` · ${job.layoutId}` : "",
											job.copies > 1 ? ` · ${job.copyIndex}/${job.copies}` : ""
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-ink-muted",
										children: job.styleName
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1",
									children: [job.imageId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "flex size-8 items-center justify-center rounded-md text-ink-muted hover:bg-stamp-soft hover:text-ink",
										"aria-label": copy.useAsSubject,
										onClick: () => {
											useImageAsSubject(job.imageId).then((ok) => {
												if (ok) toast.success(copy.usedAsSubject);
											});
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5" })
									}) : null, style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: style.previewUrl,
										alt: "",
										className: "img-outline size-8 rounded-md object-cover"
									}) : null]
								})]
							})]
						}, job.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbox, {})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-ink/50", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(96vw,960px)] -translate-x-1/2 -translate-y-1/2", "rounded-xl bg-surface p-5 shadow-[var(--shadow-border-hover)]", "max-h-[92vh] overflow-auto", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 flex size-10 items-center justify-center rounded-md text-ink-muted hover:bg-line hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function StyleDetail({ style, open, onOpenChange, onUse }) {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	if (!style) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"#",
				style.number,
				" · ",
				style.generationName
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-5 sm:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: style.previewUrl,
					alt: style.generationName,
					className: "img-outline aspect-square w-full rounded-lg object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: style.groupId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: lang === "vi" ? style.groupLabelVi : style.groupLabelEn
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-ink-muted",
							children: [
								lang === "vi" ? "Tác giả / tên style" : "Author / style name",
								": ",
								style.reference
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed",
							children: style.traits
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-auto w-fit",
							onClick: () => onUse(style.number),
							children: copy.useStyle
						})
					]
				})]
			})]
		})
	});
}
function StyleGrid({ compact = false }) {
	const lang = useStudio((s) => s.lang);
	const search = useStudio((s) => s.search);
	const setSearch = useStudio((s) => s.setSearch);
	const groupFilter = useStudio((s) => s.groupFilter);
	const setGroupFilter = useStudio((s) => s.setGroupFilter);
	const onlyFavorites = useStudio((s) => s.onlyFavorites);
	const setOnlyFavorites = useStudio((s) => s.setOnlyFavorites);
	const selected = useStudio((s) => s.selected);
	const toggleStyle = useStudio((s) => s.toggleStyle);
	const setSelected = useStudio((s) => s.setSelected);
	const clearSelected = useStudio((s) => s.clearSelected);
	const favorites = useStudio((s) => s.styleFavorites);
	const toggleFav = useStudio((s) => s.toggleStyleFavorite);
	const copy = t(lang);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const styles = (0, import_react.useMemo)(() => filterStyles({
		query: search,
		group: groupFilter,
		favorites,
		onlyFavorites
	}), [
		search,
		groupFilter,
		favorites,
		onlyFavorites
	]);
	const visibleNumbers = styles.map((s) => s.number);
	const allVisibleSelected = visibleNumbers.length > 0 && visibleNumbers.every((n) => selected.includes(n));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 flex-1 flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex flex-col border-b border-line px-3 sm:px-5", compact ? "gap-2 py-2" : "gap-3 py-3 sm:py-4"),
				children: [
					compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl leading-tight font-medium tracking-tight",
							children: copy.styles
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-ink-subtle tabular-nums",
							children: [
								styles.length,
								copy.of,
								STYLES.length,
								" · ",
								selected.length,
								" ",
								copy.selected
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink",
								onClick: () => {
									if (allVisibleSelected) setSelected(selected.filter((n) => !visibleNumbers.includes(n)));
									else setSelected([.../* @__PURE__ */ new Set([...selected, ...visibleNumbers])]);
								},
								children: copy.selectAllVisible
							}), selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full px-3 text-xs text-ink-muted hover:bg-stamp-soft hover:text-ink",
								onClick: clearSelected,
								children: copy.clear
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: copy.searchStyles,
							className: cn("pl-9 text-base lg:text-sm", compact && "h-10")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chip-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupChip, {
								active: groupFilter === "all" && !onlyFavorites,
								onClick: () => {
									setGroupFilter("all");
									setOnlyFavorites(false);
								},
								children: copy.allGroups
							}),
							GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupChip, {
								active: groupFilter === g.id,
								title: lang === "vi" ? g.labelVi : g.labelEn,
								onClick: () => {
									setGroupFilter(g.id);
									setOnlyFavorites(false);
								},
								children: g.id
							}, g.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupChip, {
								active: onlyFavorites,
								onClick: () => {
									setOnlyFavorites(!onlyFavorites);
									setGroupFilter("all");
								},
								children: copy.favorites
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "min-h-0 flex-1",
				children: styles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-sm text-ink-muted",
					children: copy.noResults
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-3 2xl:grid-cols-4",
					children: styles.map((style) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleCard, {
						style,
						selected: selected.includes(style.number),
						favored: favorites.includes(style.number),
						onToggle: () => toggleStyle(style.number),
						onFav: () => toggleFav(style.number),
						onDetail: () => setDetail(style.number)
					}, style.number))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleDetail, {
				style: detail ? getStyle(detail) : void 0,
				open: Boolean(detail),
				onOpenChange: (o) => !o && setDetail(null),
				onUse: (n) => {
					if (!selected.includes(n)) toggleStyle(n);
					setDetail(null);
				}
			})
		]
	});
}
function GroupChip({ active, onClick, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title,
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3 text-xs font-medium whitespace-nowrap", active ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink"),
		children
	});
}
function StyleCard({ style, selected, favored, onToggle, onFav, onDetail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group relative rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out", "hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]", selected && "ring-2 ring-stamp ring-offset-2 ring-offset-bg"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onToggle,
				className: "block w-full text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-square overflow-hidden rounded-lg bg-bg-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: style.previewUrl,
							alt: `#${style.number} ${style.generationName}`,
							loading: "lazy",
							decoding: "async",
							className: "img-outline size-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("absolute top-1.5 left-1.5 rounded-sm px-1.5 py-0.5 font-mono text-xs tabular-nums", selected ? "bg-stamp text-stamp-fg" : "bg-ink/80 text-bg-elevated"),
							children: style.number
						}),
						selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full bg-stamp text-stamp-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-2 pt-2 pb-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 min-h-8 text-xs leading-snug font-medium",
						children: style.generationName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-ink-subtle",
						children: style.reference
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-2.5 right-2.5 flex gap-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						onFav();
					},
					className: cn("flex size-8 items-center justify-center rounded-md bg-surface/90 text-ink-muted shadow-[var(--shadow-border)] hover:text-stamp", favored ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"),
					"aria-label": "Favorite",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-3.5", favored && "fill-stamp text-stamp") })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onDetail,
				className: cn("absolute right-2.5 bottom-10 h-7 items-center rounded-full bg-ink px-2.5 text-xs text-bg", selected ? "hidden" : "hidden group-hover:inline-flex"),
				children: style.groupId
			})
		]
	});
}
function useDesktopLayout() {
	const [desktop, setDesktop] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const apply = () => setDesktop(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return desktop;
}
function StudioWorkspace() {
	const lang = useStudio((s) => s.lang);
	const copy = t(lang);
	const tab = useStudio((s) => s.studioTab);
	const setTab = useStudio((s) => s.setStudioTab);
	const selected = useStudio((s) => s.selected.length);
	const layoutOn = useStudio((s) => Boolean(s.layoutId));
	const live = useStudio((s) => s.jobs.filter((j) => j.status === "queued" || j.status === "running").length);
	const hasJobs = useStudio((s) => s.jobs.length > 0);
	const desktop = useDesktopLayout();
	const leftKind = tab === "layouts" ? "layouts" : "styles";
	const libraryTabs = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex shrink-0 gap-1 px-3 pt-2 sm:px-5",
		children: [[
			"styles",
			copy.styles,
			selected
		], [
			"layouts",
			copy.layouts,
			layoutOn ? 1 : 0
		]].map(([id, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setTab(id),
			className: cn("h-9 rounded-full px-3 text-sm font-medium", leftKind === id ? "bg-ink text-bg" : "bg-bg-elevated text-ink-muted hover:text-ink"),
			children: [label, count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1 font-mono text-xs tabular-nums",
				children: count
			}) : null]
		}, id))
	});
	const tabs = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex shrink-0 px-3 pt-2 pb-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-full rounded-full bg-bg-elevated p-1 shadow-[var(--shadow-border)]",
			children: [
				[
					"styles",
					copy.styles,
					selected
				],
				[
					"layouts",
					copy.layouts,
					layoutOn ? 1 : 0
				],
				[
					"results",
					copy.results,
					live
				]
			].map(([id, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: cn("relative h-10 flex-1 rounded-full text-sm font-medium transition-colors duration-150", tab === id ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-ink-muted"),
				children: [label, count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1 font-mono text-xs text-stamp tabular-nums",
					children: count
				}) : null]
			}, id))
		})
	});
	if (desktop) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposePanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(qt, {
					orientation: "horizontal",
					className: "h-full w-full",
					id: "handraw-studio",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Qt, {
							id: "styles",
							defaultSize: "42%",
							minSize: "28%",
							className: "flex min-h-0 flex-col",
							children: [libraryTabs, leftKind === "layouts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid$1, { compact: false }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleGrid, { compact: false })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(nn, {
							className: "relative w-3 bg-transparent outline-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qt, {
							id: "results",
							defaultSize: "58%",
							minSize: "32%",
							className: "flex min-h-0 flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCanvas, {})
						})
					]
				})
			}),
			hasJobs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDock, {}) : null
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden",
		children: [
			tabs,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col overflow-hidden",
				children: tab === "layouts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid$1, { compact: true }) : tab === "styles" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleGrid, { compact: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveCanvas, {})
			}),
			hasJobs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDock, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposePanel, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioWorkspace, {});
}
//#endregion
export { Home as component };
