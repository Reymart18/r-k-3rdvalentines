export interface Story {
    id: number;
    label: string;
    cover: string;
    slides: { img: string; caption: string }[];
}
