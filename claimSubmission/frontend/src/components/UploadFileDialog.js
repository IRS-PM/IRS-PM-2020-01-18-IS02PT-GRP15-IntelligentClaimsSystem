import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, Box, Button, Typography, IconButton, Tooltip, CircularProgress } from '@material-ui/core'
import { FileDropZone, image } from 'mui-dropzone'
import { InsertDriveFileOutlined as FileIcon, CloseOutlined } from '@material-ui/icons';
import { uploadFile } from '../httpActions/uploadFile';
import { store } from '../store/store';
import { ACTION_TYPES } from '../store/actionTypes';

const useStyles = makeStyles(theme => ({
    fileContainer: {
        height: 200,
        backgroundColor: theme.palette.grey[100]
    },
    dropZone: {
        height: '100%',
        '& h4': {
            ...theme.typography.body1
        }
    },
    uploadedFile: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        '& > *': {
            marginRight: theme.spacing(1),

            '&:last-child': {
                marginRight: 0
            }
        }
    },
    loading: {
        marginLeft: theme.spacing(1)
    }
}))

export function UploadFileDialog({
    open = false,
    uploadFileType = 'hospitalBill',
    handleClose = () => {},
    handleUploadComplete = (file) => {}
}) {

    const cssClasses = useStyles({})
    const [file, setFile] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const { dispatch } = React.useContext(store)

    React.useEffect(() => {
        if (open) {
            setFile(null)
        }
    }, [open])
    
    const handleFileChange = (files) => {
        if (!files[0]) {
            setFile(null)
        } else {
            setFile(files[0])
        }
    }

    const handleFileRejected = (evt) => {
        setFile(null)
        dispatch({
            type: ACTION_TYPES.ADD_TOAST_MESSAGE,
            payload: 'This file type is not allowed'
        })
    }

    const handleSubmit = async () => {
        if (!file) return
        try {
            setIsLoading(true)
            const { data } = await uploadFile(uploadFileType, file)
            handleUploadComplete(data)
        } catch (e) {
            dispatch({
                type: ACTION_TYPES.ADD_TOAST_MESSAGE,
                payload: 'Error uploading file'
            })
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
            <DialogTitle>Upload Bill</DialogTitle>
            <DialogContent>
                <Box className={cssClasses.fileContainer}>
                    {!!file?
                        (
                            <Box className={cssClasses.uploadedFile}>
                                <FileIcon />
                                <Typography>{file.name}</Typography>
                                <Tooltip title="Remove">
                                    <IconButton color="secondary" onClick={()=>setFile(null)}><CloseOutlined /></IconButton>
                                </Tooltip>
                            </Box>
                        )
                        : (
                            <FileDropZone
                                acceptedMimeTypes={['image/png','image/jpg','image/jpeg','image/gif','image/bmp','application/pdf']}
                                onFilesAdded={handleFileChange}
                                onFilesRejected={handleFileRejected}
                                blockOtherDrops={true}
                                className={cssClasses.dropZone}
                            />
                        )
                    }
                </Box>
                <br />
                <Typography variant="caption">*Supported file formats: png, jpg, gif, bmp, and pdf</Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    color="secondary" 
                    onClick={handleClose}
                >Cancel</Button>
                <Button 
                    color="primary" 
                    variant="contained" 
                    disabled={!file || isLoading}
                    onClick={handleSubmit}
                >
                    Submit 
                    {isLoading && <CircularProgress color="" size={10} className={cssClasses.loading} />} 
                </Button>
            </DialogActions>
        </Dialog>
    )
}