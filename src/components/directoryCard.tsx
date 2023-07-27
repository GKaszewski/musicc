import { Card, CardBody, Heading, Text, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { useAppStore } from "../store/store";
import { getDirName } from "../utils";

interface Props extends PropsWithChildren {
	dirPath: string;
	dirElements: string[];
}

const DirectoryCard = ({ dirPath, dirElements, children }: Props) => {
	const { setSelectedDirectory } = useAppStore(state => state);

	const handleClick = () => {
		setSelectedDirectory(dirPath);
	}

	return (
		<LinkBox>
			<LinkOverlay href="#" onClick={handleClick}>
				<Card
					maxW="sm"
					height="40"
					rounded="none"
					roundedBottomEnd="xl"
					bg="yellow.300"
				>
					<CardBody>
						<Heading fontSize="4xl" isTruncated>
							{getDirName(dirPath)}
						</Heading>
						<Text mt={4}>({dirElements.length})</Text>
					</CardBody>
				</Card>
			</LinkOverlay>
		</LinkBox>
	);
};

export default DirectoryCard;