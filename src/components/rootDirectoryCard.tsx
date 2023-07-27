import { LinkBox, LinkOverlay, Card, CardBody, Text } from "@chakra-ui/react";
import { useAppStore } from "../store/store";
import { getDirName } from "../utils";

const RootDirectoryCard = () => {
	const { setSelectedDirectory, selectedDirectory } = useAppStore(state => state);

	const handleClick = () => {
		setSelectedDirectory("");
	}

		return (
			<LinkBox>
				<LinkOverlay href="#" onClick={handleClick}>
					<Card
						rounded="none"
						roundedBottomEnd="xl"
						size="sm"
						bg="yellow.300"
					>
						<CardBody>
							<div className="w-full h-full flex mx-auto justify-center items-center">
								<Text boxSize={20} fontSize="4xl" isTruncated>
									...
								</Text>
							</div>
						</CardBody>
					</Card>
				</LinkOverlay>
			</LinkBox>
		);
}

export default RootDirectoryCard;