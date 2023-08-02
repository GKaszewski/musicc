import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Heading, IconButton, Input, InputGroup, InputLeftElement, InputRightAddon } from "@chakra-ui/react";
import { dialog } from "@tauri-apps/api";

import {GoFileDirectoryFill} from 'react-icons/go'
import {FaPlus} from 'react-icons/fa'
import { useSettingsStore } from "../store/store";

const Preferences = () => {
    const {selectedDirectory, setSelectedDirectory, setDirectories, directories} = useSettingsStore(state => state);

    const handleBrowse = async () => {
        const dir = await dialog.open({
            directory: true
        });

        setSelectedDirectory(dir as string);
    }

    const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDirectory(e.target.value);
    }

    const handleAddDirectory = () => {
        if (selectedDirectory == null || selectedDirectory == "") {
            return;
        }

        setDirectories([...directories, selectedDirectory]);
        setSelectedDirectory("");
    }

    return <div className="w-full h-full flex flex-col items-center relative gap-4">
        <Heading fontFamily="Roboto">Preferences</Heading>
        <div className="w-full px-4 flex">
            <InputGroup>
            <InputLeftElement pointerEvents="none">
                <GoFileDirectoryFill />
            </InputLeftElement>
            <Input value={selectedDirectory || ""} onChange={handleDirectoryChange} placeholder="Enter directory path" />
            <InputRightAddon>
                <Button variant="ghost" onClick={handleBrowse}>Choose</Button>
            </InputRightAddon>
            </InputGroup>
            <IconButton onClick={handleAddDirectory} aria-label="Add directory" icon={<FaPlus />} />
        </div>
        <Accordion className="w-full px-4" allowToggle>
                <AccordionItem>
                <AccordionButton>
                    <Heading fontFamily="Roboto" fontSize="1.5rem" flex="1" textAlign="left">
                        Directories
                    </Heading>            
                </AccordionButton>
                <AccordionPanel>
                    <Box className="w-full flex flex-col gap-2">
                        {directories.map((dir, index) => {
                            return <div key={index} className="w-full flex flex-row items-center gap-2">
                                <GoFileDirectoryFill />
                                <p>{dir}</p>
                            </div>
                        }
                        )}
                    </Box>
                </AccordionPanel>
                </AccordionItem>
        </Accordion>
    </div>
};

export default Preferences;