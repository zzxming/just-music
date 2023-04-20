<template>
	<div
		class="player"
		v-loading="loadingInfo"
	>
		<div
			class="player_info"
			v-if="songInfo"
		>
			<div class="player_header">
				<div class="player_title">
					<span v-textRoll>{{ songInfo.title }}</span>
				</div>
				<div
					class="player_singer"
					:title="songInfo.singers.map((item) => item.name).join(' / ')"
				>
					<span v-textRoll>{{ songInfo.singers.map((item) => item.name).join(' / ') }}</span>
				</div>
			</div>
			<div class="player_cover">
				<img
					v-lazy="mediaSrc(songInfo.cover)"
					:key="songInfo.cover"
					alt="歌曲封面"
				/>
			</div>
			<div class="player_song_info">
				<div class="player_title">{{ songInfo.title }}</div>
				<span class="player_info_label">
					{{
						songInfo.publishTime === 0
							? ''
							: new Date(songInfo.publishTime).toLocaleDateString().split('/').join('-')
					}}
				</span>
				<div class="player_origin">
					<span class="player_info_label">来源：</span>
					{{
						t === AudioInfoType.bili
							? '哔哩哔哩'
							: t === AudioInfoType.cloud
							? '网易云音乐'
							: t === AudioInfoType.local && songInfo.id
							? 'just音乐'
							: '未知'
					}}
				</div>
				<div class="player_singer">
					<span class="player_info_label">歌手：</span>
					{{ songInfo.singers.map((item) => item.name).join(' / ') }}
				</div>
				<div class="player_ablum">
					<span class="player_info_label">专辑：</span>
					{{ songInfo.album }}
				</div>
				<div class="player_control">
					<el-button
						class="player_control_btn full"
						color="#f56c6c"
						@click="playAudio"
						>播放</el-button
					>
					<el-button
						class="player_control_btn"
						color="#f56c6c"
						plain
						@click.stop="collectAudio"
						>收藏</el-button
					>
				</div>
			</div>
		</div>

		<div
			class="player_list"
			v-show="!loadingInfo && !loadInfoError"
		>
			<template v-if="t === AudioInfoType.bili">
				<LoadingMore
					:requestFunc="getSongData"
					:isStatic="true"
				>
					<Songlist :songs="songList" />
				</LoadingMore>
			</template>
			<Songlist
				v-else
				:songs="songList"
			/>
		</div>

		<div class="player_other"></div>

		<Popout
			:show="popoutVisible"
			:position="popoutPosition"
			@close="popoutVisible = false"
		>
			<CollectToPlaylistPopout />
		</Popout>
		<LoadingErrorTip
			:isError="loadInfoError"
			:style="{ height: '100%' }"
			:requestFunc="
				() => {
					requesSongData();
					getSongData();
				}
			"
		/>
	</div>
</template>

<style lang="less" scoped>
	.player {
		box-sizing: border-box;
		display: grid;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		grid-template-areas:
			'info other'
			'list .';
		grid-template-columns: 1fr 300px;
		grid-row-gap: 20px;
		width: 100%;
		margin: 20px 0 100px;
		padding: 20px 40px 10px;
		min-height: calc(100vh - 64px - 80px - 40px);
		background-color: var(--el-color-white);
		&_info {
			box-sizing: border-box;
			grid-area: info;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			width: 100%;
			height: 100%;
			padding: 0 20px;
			&_label {
				color: var(--el-color-info);
			}
		}
		&_other {
			grid-area: other;
		}
		&_header {
			display: none;
			width: 100%;
			.player_title,
			.player_singer {
				overflow: hidden;
				white-space: nowrap;
				width: 100%;
			}
			.player_singer {
				color: var(--el-color-info);
				margin-bottom: 10px;
			}
		}
		&_title {
			line-height: 40px;
			font-size: 30px;
			margin-bottom: 10px;
		}
		&_singer {
			line-height: 24px;
		}
		&_song_info {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			width: 100%;
			margin-left: 40px;
			font-size: 14px;
		}
		&_cover {
			display: flex;
			width: 50%;
			margin-top: 20px;
			border-radius: 8px;
			border: 1px solid var(--el-border-color);
			overflow: hidden;
			user-select: none;
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
				border-radius: 8px;
				overflow: hidden;
			}
		}
		&_control {
			display: flex;
			align-items: center;
			justify-content: space-around;
			width: 100%;
			margin-top: 20px;
			&_btn {
				padding: 0 30px;
				color: var(--el-color-danger);
				&:hover {
					color: var(--el-color-white);
				}
				&:active,
				&:focus {
					color: var(--el-button-active-text-color);
				}
				&:focus-visible {
					outline: 2px solid var(--el-button-border-color);
				}
			}
			.full {
				color: var(--el-color-white);
			}
		}
		&_list {
			grid-area: list;
			min-height: 36px;
			border: 1px solid var(--el-color-info-light-7);
			border-radius: 8px;
			overflow: hidden;
		}
	}
	@media screen and (max-width: 980px) {
		.player {
			grid-template-areas:
				'info'
				'list'
				'other';
			grid-template-columns: 1fr;
			padding-left: 40px;
			padding-right: 40px;
		}
	}
	@media screen and (max-width: 550px) {
		.player {
			margin-bottom: 80px;
			padding-left: 0px;
			padding-right: 0px;
			&_info {
				box-sizing: border-box;
				flex-direction: column;
				align-items: center;
			}
			&_start {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			&_header {
				display: grid;
				text-align: center;
			}
			&_left {
				flex-direction: column;
				width: 100%;
				min-width: auto;
			}
			&_song_info {
				margin: 0;
				margin-top: 20px;
				align-items: center;
				.player_title,
				.player_singer {
					display: none;
				}
			}
		}
	}
</style>

<script lang="ts" setup>
	import { ElMessage } from 'element-plus';
	import { mediaSrc } from '@/assets/api';
	import { getCloudMusicInfoWithId } from '@/assets/cloudApi';
	import { getLocalMusicInfoWithId, searchMusicInfoWIthBvid, getBiliAudioForPlaylist } from '@/assets/localApi';
	import { usePlayerStore, usePlaylistStore, usePopoutStore } from '@/store';
	import { AudioInfoType, MusicInfo } from '@/interface';
	import { formatMusicInfo } from '@/utils/format';
	import { PopoutPosition } from '@/components/Popout/index.vue';

	const props = defineProps<{
		id: number | string;
		t: AudioInfoType;
	}>();
	const playerStore = usePlayerStore();
	const { audio } = storeToRefs(playerStore);
	const { setAudioInfo } = playerStore;
	const playinglist = usePlaylistStore();
	const { playinglistReplace } = playinglist;
	const popoutStore = usePopoutStore();

	const songInfo = ref<MusicInfo>();
	const songList = ref<MusicInfo[]>([]);
	const loadingInfo = ref(false);
	const loadInfoError = ref(false);
	const popoutVisible = ref(false);
	const popoutPosition = ref<PopoutPosition>({
		left: 0,
		top: 0,
	});

	watch(
		[() => props.id, () => props.t],
		() => {
			songList.value = [];
			songInfo.value = undefined;
			requesSongData();
		},
		{ immediate: true }
	);

	/** 获取音频信息 */
	async function requesSongData() {
		loadInfoError.value = false;
		if (props.t === AudioInfoType.bili) {
			loadingInfo.value = true;
			let [err, result] = await getBiliAudioForPlaylist(String(props.id));
			// getSongData();
			loadingInfo.value = false;

			if (!err && result) {
				let data = result.data.data;
				// 手动修改字段成歌曲类型
				songInfo.value = {
					type: AudioInfoType.bili,
					id: data.id,
					cid: 0,
					title: data.title,
					cover: data.cover,
					singers: [
						{
							id: data.creator.userId,
							name: data.creator.name,
						},
					],
					duration: 0,
					album: data.title,
					publishTime: data.updateTime,
					fee: 0,
					noCopyrightRcmd: null,
					st: 0,
					full: true,
				};
			} else {
				loadInfoError.value = true;
				ElMessage({
					type: 'error',
					message: err?.message,
				});
			}
			return;
		}
		// console.log(props.id, props.t);
		loadingInfo.value = true;
		let [err, result] =
			props.t === AudioInfoType.cloud
				? await getCloudMusicInfoWithId({ ids: Number(props.id) })
				: await getLocalMusicInfoWithId({ id: Number(props.id) });

		loadingInfo.value = false;
		if (!err && result) {
			let data = result.data.data;
			let musicInfo = formatMusicInfo(data, props.t);
			songInfo.value = musicInfo;
			songList.value = [musicInfo];
			// console.log(songInfo.value)
		} else {
			loadInfoError.value = true;
			ElMessage({
				type: 'error',
				message: err?.message,
			});
		}
	}
	async function getSongData() {
		songList.value = [];
		let [err, result] = await searchMusicInfoWIthBvid(String(props.id));
		if (!err && result) {
			songList.value = formatMusicInfo(result.data.data, props.t);
		} else {
			ElMessage({
				type: 'error',
				message: err?.message,
			});
		}
		return 0;
	}
	/** 收藏按钮 */
	function collectAudio(e: MouseEvent) {
		if (!songInfo.value) return;
		const { pageX, pageY } = e;
		popoutVisible.value = true;
		popoutPosition.value = {
			left: pageX,
			top: pageY,
		};

		if (props.t === AudioInfoType.bili) {
			popoutStore.popoutHoldData = songList.value as MusicInfo[];
		} else {
			popoutStore.popoutHoldData = songInfo.value;
		}
	}
	/** 音频播放与暂停 */
	function playAudio() {
		let audioDom = audio.value;
		if (audioDom) {
			if (props.t === AudioInfoType.bili && songList.value) {
				setAudioInfo(songList.value[0]);
				playinglistReplace(songList.value);
			} else if (songInfo.value) {
				setAudioInfo(songInfo.value);
				playinglistReplace([songInfo.value]);
			}
		}
	}
</script>
